import React, { useState } from 'react';
import { TfiClose } from "react-icons/tfi";
import Modal from 'react-modal';
import AnimationButton from '../../common/AnimationButton';
import { useAuth } from '../../auth/useAuthClient';
import { useNavigate } from 'react-router-dom';

const CreateTokenModal = ({ modalIsOpen, setIsOpen }) => {
  const { createCustomActor } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    token_name: '',
    token_symbol: '',
    decimals: '',
    total_supply: ''
  });

  const [validationError, setValidationError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const { token_name, token_symbol, decimals, total_supply } = formData;

    const decimalsNumber = Number(decimals);

    // Validating decimals is a number between 0 and 255
    if (isNaN(decimalsNumber) || decimalsNumber < 0 || decimalsNumber > 255) {
      setValidationError("Decimals must be a number between 0 and 255.");
      return;
    }

    // Check if all fields are filled and terms are accepted
    if (!token_name || !token_symbol || !decimals || !total_supply || !termsAccepted) {
      setValidationError("Please fill in all the details and accept the terms.");
      return;
    }

    try {
      const actor = createCustomActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND);

      const tokenData = {
        token_name,
        token_symbol,
        decimals: [decimalsNumber], // Wrap decimals in an optional nat8 array
        total_supply: parseInt(total_supply, 10),
        
      };

      const response = await actor.create_token(tokenData);
      console.log('Token created:', response);

      // Navigate to verify-token page after successful creation
      navigate('/verify-token');
    } catch (err) {
      console.error(err);
      setValidationError("An error occurred while creating the token.");
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="mx-[50px]">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create Token Modal"
        className="fixed inset-0 flex items-center justify-center lg:mb-[60%] lgx:mb-[10%] bg-transparent"
        overlayClassName="fixed z-[100] inset-0 bg-gray-800 bg-opacity-50"
        ariaHideApp={false} // Only if you don't want modal to block the main content from screen readers
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#222222] p-6 rounded-md text-white w-[786px] relative">
            <div className="bg-[#FFFFFF4D] mx-[-24px] mt-[-25px] px-4 py-1 mb-4 rounded-2xl">
              {/* Modal Close Button */}
              <button
                onClick={closeModal}
                className="absolute right-8 text-[30px] text-white"
              >
                <TfiClose />
              </button>
              <h2 className="text-[25px] font-semibold">Create Token</h2>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-[18px]">Name</label>
                <input
                  type="text"
                  value={formData.token_name}
                  onChange={(e) => setFormData({ ...formData, token_name: e.target.value })}
                  className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
                />
                <small className="block text-[#cccccc] ml-6 mt-1">
                  Creation Fee: 0.4 BNB
                </small>
              </div>

              <div>
                <label className="block mb-2 text-[18px]">Symbol</label>
                <input
                  type="text"
                  value={formData.token_symbol}
                  onChange={(e) => setFormData({ ...formData, token_symbol: e.target.value })}
                  className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-[18px]">Decimals</label>
                <input
                  type="number"
                  value={formData.decimals}
                  min="0"
                  max="255"
                  onChange={(e) => setFormData({ ...formData, decimals: e.target.value })}
                  className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-[18px]">Total Supply</label>
                <input
                  type="number"
                  value={formData.total_supply}
                  onChange={(e) => setFormData({ ...formData, total_supply: e.target.value })}
                  className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center mt-4 mb-6">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="form-checkbox text-pink-600 bg-[#444444] rounded-md mr-2"
              />
              <p className="text-[15px] text-[#cccccc]">
                By creating this token, I agree to the terms and conditions.
              </p>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <p className="text-red-500 mb-4">{validationError}</p>
            )}

            {/* Gradient Button */}
            <div className="flex justify-center items-center">
              <AnimationButton text="CREATE TOKEN" onClick={handleSubmit} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateTokenModal;
