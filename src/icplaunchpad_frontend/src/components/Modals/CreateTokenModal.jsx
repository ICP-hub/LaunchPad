import React, { useState } from 'react';
import { TfiClose } from "react-icons/tfi";
import Modal from 'react-modal';
import AnimationButton from '../../common/AnimationButton';
import { useAuth } from '../../StateManagement/useContext/useAuth';
import { useNavigate } from 'react-router-dom';
import { Principal } from '@dfinity/principal';
import { useDispatch } from 'react-redux';
import { addTokenIds, addTokenData } from '../../Redux-Config/ReduxSlices/TokenSlice';

const CreateTokenModal = ({ modalIsOpen, setIsOpen }) => {
  const { actor, principal } = useAuth(); // Auth context
  const [validationError, setValidationError] = useState(''); // Validation error state
  const [termsAccepted, setTermsAccepted] = useState(false); // Terms acceptance state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch =useDispatch();
  const [formData, setFormData] = useState({
    token_name: '',
    token_symbol: '',
    decimals: '',
    listingRate:0.4,
    total_supply: '',
  });

  const amount = 0.1; // Transaction amount in ICP
  const navigate = useNavigate(); // For navigation

  // Close modal handler
  const closeModal = () => {
    setIsOpen(false);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    setIsSubmitting(true)
    e.preventDefault();
    setValidationError('');

    const { token_name, token_symbol, decimals, total_supply } = formData;
    const decimalsNumber = parseInt(decimals);

    // Validate decimals
    if (isNaN(decimalsNumber) || decimalsNumber < 0 || decimalsNumber > 255) {
      setValidationError("Decimals must be a number between 0 and 255.");
      setIsSubmitting(false);
      return;
    }

    // Validate form fields and terms acceptance
    if (!token_name || !token_symbol || !decimals || !total_supply || !termsAccepted) {
      setValidationError("Please fill in all the details and accept the terms.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Send transaction using Plug Wallet
      // const transactionResult = await window.ic.plug.requestTransfer({
      // //   to: userPrincipal,
      // //   amount: amount * 1e8, // Convert ICP to its smallest unit (8 decimals)
      // // });

      // if (transactionResult) {

      // Convert userPrincipal to Principal type
      const ownerPrincipal = Principal.fromText(principal);

      // Token data structure for canister call
      const tokenData = {
        token_name,
        token_symbol,
        decimals: [decimalsNumber],
        initial_balances: [
          [
            {
              owner: ownerPrincipal, // Principal object for owner
              subaccount: [], // Optional subaccount, empty array if unused
            },
            BigInt(total_supply), // Total supply as Nat (BigInt)
          ],
        ],
      };

        console.log('Token data:', tokenData);
        const response = await actor.create_token(tokenData);
        console.log('Token created:', response);
        if(response){
        const {ledger_canister_id, index_canister_id}=response.Ok;
        dispatch( addTokenIds({ledger_canister_id:ledger_canister_id.toText(),index_canister_id: index_canister_id.toText() }))
        }


        // fetching token data and storing into redux store
        // if(response){
        //  const tokenData= await actor.get_tokens_info();
        //  console.log('Token data after creation:', tokenData);
        //  dispatch(addTokenData(tokenData))
        // }

      const ledger_canister_id = response.Ok.ledger_canister_id._arr;

        // Navigate to verify-token page
        navigate('/verify-token', { state: { formData, ledger_canister_id} });

      // } else {
      //   setValidationError("Transaction failed.");
      // }
    } catch (err) {
      console.error("Error creating token:", err);
      setValidationError("An error occurred while creating the token.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-[50px]">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create Token Modal"
        className="fixed inset-0 flex items-center justify-center lg:mb-[60%] lgx:mb-[10%] bg-transparent"
        overlayClassName="fixed z-[100] inset-0 bg-opacity-50"
        ariaHideApp={false} // Disable blocking main content for screen readers
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#222222] p-6 rounded-2xl text-white m-4 w-[786px] relative">
            <div className="bg-[#FFFFFF4D] mx-[-24px] mt-[-25px] px-4 py-1 mb-4 rounded-2xl">
              {/* Modal Close Button */}
              <button
                onClick={closeModal}
                className="absolute mt-1 right-8 text-[25px] md:text-[30px] text-white"
              >
                <TfiClose />
              </button>
              <h2 className="text-[20px] font-medium md:text-[25px] md:font-semibold">
                Create Token
              </h2>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              {/* Token Name */}
              <div>
                <label className="block mb-2 text-[18px]">Name</label>
                <input
                  type="text"
                  value={formData.token_name}
                  onChange={(e) =>
                    setFormData({ ...formData, token_name: e.target.value })
                  }
                  className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
                />
                <small className="block text-[#cccccc]  xxs1:ml-6 mt-1">
                  Creation Fee: 0.4 BNB
                </small>
              </div>

              {/* Token Symbol */}
              <div>
                <label className="block mb-2 text-[18px]">Symbol</label>
                <input
                  type="text"
                  value={formData.token_symbol}
                  onChange={(e) =>
                    setFormData({ ...formData, token_symbol: e.target.value })
                  }
                  className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
                />
              </div>

              {/* Token Decimals */}
              <div>
                <label className="block mb-2 text-[18px]">Decimals</label>
                <input
                  type="number"
                  value={formData.decimals}
                  min="0"
                  max="255"
                  onChange={(e) =>
                    setFormData({ ...formData, decimals: e.target.value })
                  }
                  className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
                />
              </div>

              {/* Total Supply */}
              <div>
                <label className="block mb-2 text-[18px]">Total Supply</label>
                <input
                  type="number"
                  value={formData.total_supply}
                  onChange={(e) =>
                    setFormData({ ...formData, total_supply: e.target.value })
                  }
                  className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
                />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start xxs1:items-center mt-4 mb-6">
              <input
                type="checkbox"
                id="termsCheckbox"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="hidden peer"
              />
              <div
                className={`w-4 h-4 border-2 flex items-center mt-1 justify-center rounded-sm mr-2 cursor-pointer 
                ${termsAccepted ? "" : "border-white bg-transparent"}`}
              >
                <label
                  htmlFor="termsCheckbox"
                  className="cursor-pointer w-full h-full flex items-center justify-center "
                >
                  {termsAccepted && <span className="text-[#F3B3A7]">✓</span>}
                </label>
              </div>
              <p className="text-[15px] text-[#cccccc]">
                By creating this token, I agree to the terms and conditions.
              </p>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <p className="text-red-500 mb-4">{validationError}</p>
            )}

            {/* Create Token Button */}
            <div className="flex justify-center items-center">
              <AnimationButton
                text="CREATE TOKEN"
                onClick={handleSubmit}
                loading={isSubmitting}
                isDisabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateTokenModal;