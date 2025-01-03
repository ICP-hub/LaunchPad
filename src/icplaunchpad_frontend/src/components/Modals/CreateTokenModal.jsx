
import React, { useState ,useEffect, useLayoutEffect} from "react";
import { TfiClose } from "react-icons/tfi";
import Modal from "react-modal";
import AnimationButton from "../../common/AnimationButton";
import { useNavigate } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import {useIdentity } from "@nfid/identitykit/react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as ledgerIDL } from "../../StateManagement/useContext/ledger.did";
import timestampAgo, { getExpirationTimeInMicroseconds } from "../../utils/timeStampAgo";
import { useAuths } from "../../StateManagement/useContext/useClient";

// Define the validation schema using Yup
const tokenSchema = yup.object().shape({
  token_name: yup
    .string()
    .required("Token name is required")
    .trim("Token name should not have leading or trailing spaces")
    .strict(true)
    .matches(/^[A-Za-z\s]+$/, "Token name can only contain letters and spaces")
    .test(
      "no-leading-space",
      "Token name should not start with a space",
      (value) => value && value[0] !== " "
    )
    .min(3, "Token name must be at least 3 characters long")
    .max(50, "Token name cannot be more than 50 characters long"),

  // Token symbol validation
  token_symbol: yup
    .string()
    .required("Token symbol is required")
    .test(
      "is-valid-username",
      "Token symbol must be between 3 and 20 characters, contain no spaces, and only include letters, numbers, underscores, or '@'.",
      (value) => {
        const isValidLength = value && value.length >= 3 && value.length <= 20;
        const isValidFormat = /^[a-zA-Z0-9_@-]+$/.test(value); // Allows letters, numbers, underscores, '@', and '-'
        const noSpaces = !/\s/.test(value);
        return isValidLength && isValidFormat && noSpaces;
      }
    ),

  decimals: yup
    .number()
    .typeError("Decimals must be a number")
    .required("Decimals are required")
    .positive("Decimals must be positive")
    .integer("Decimals must be an integer")
    .min(1, "Decimals must be greater than 0")
    .max(64, "Decimals must be less than or equal to 64"),


  total_supply: yup
    .number()
    .typeError("Total supply must be a number")
    .required("Total supply is required")
    .positive("Total supply must be positive")
    
});

const CreateTokenModal = ({ modalIsOpen, setIsOpen }) => {
  const actor = useSelector((currState) => currState.actors.actor);


  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const principal = useSelector((currState) => currState.internet.principal);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const { signerId } = useAuths();
  // const identity = useIdentity();
  const  identity=[]
  const LOCAL_HOST = "http://127.0.0.1:4943";
  const MAINNET_HOST = "https://icp0.io";
  const HOST = process.env.DFX_NETWORK === "ic" ? MAINNET_HOST : LOCAL_HOST;




  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(tokenSchema),
    mode:'all'
  });

  useEffect(()=>{
    setIsVisible(true)
  },[modalIsOpen])

  // Close modal handler
  const closeModal = () => {
    setIsVisible(false)
    setTimeout(() => setIsOpen(false), 300); // Match transition duration
    reset();
  };


  const [fee, setFee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFee = async () => {
      try {
          const response = await actor.fee_for_creation_token();
          if (!response) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setFee(data.fee);

      } catch (error) {
          setError(error.message);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchFee();
  }, []);

  // Form submission handler
  const onSubmit = async (formData) => {
    setValidationError('');
    setIsSubmitting(true);

    console.log("Form data received:", formData);

    if (!termsAccepted) {
        const errorMsg = "Please accept the terms and conditions.";
        setValidationError(errorMsg);
        setIsSubmitting(false);
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    try {
        const { token_name, token_symbol, decimals, total_supply } = formData;
        const ownerPrincipal = Principal.fromText(principal);
        console.log("Owner Principal:", ownerPrincipal);

        const tokenData = constructTokenData({ token_name, token_symbol, decimals, total_supply, ownerPrincipal });
        console.log("Token data constructed:", tokenData);

        const network = process.env.DFX_NETWORK;
        const isLocalNetwork = network !== 'ic';
        const isMainlNetwork = network === 'ic';

        console.log("Network detected:", network);

        if (signerId === 'Plug') {
            console.log("Signer is Plug. Setting up HttpAgent...");
            const agent = await setupHttpAgent({ isLocalNetwork });
            const ledgerActor = createLedgerActor(agent);
console.log('ledgerActor',ledgerActor)
const Amount = BigInt(Math.round(fee * 10 ** 8) + 10000); 

            const icrc2ApproveArgs = prepareICRC2ApproveArgs(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND, Amount);
            console.log("ICRC2 approve arguments:", icrc2ApproveArgs);

            await handleICRC2ApprovalAndTokenCreation({
                ledgerActor,
                icrc2ApproveArgs,
                actor,
                ownerPrincipal,
                tokenData,
                formData,
            });
        } else {
            console.log("Creating token without Plug...");
            const response = await actor.create_token(tokenData);
            handleTokenCreationResponse(response, formData);
        }
        const agent = await setupHttpAgent({ isMainlNetwork });
        const ledgerActor = createLedgerActor(agent);
        const Amount = BigInt(Math.round(fee * 10 ** 8) + 10000); 

        const icrc2ApproveArgs = prepareICRC2ApproveArgs('oiell-5iaaa-aaaar-qamaq-cai', Amount);
        console.log("ICRC2 approve arguments:", icrc2ApproveArgs);

        await handleICRC2ApprovalAndTokenCreation({
            ledgerActor,
            icrc2ApproveArgs,
            actor,
            ownerPrincipal,
            tokenData,
            formData,
        });
    } catch (error) {
        console.error("Error during token creation or approval:", error);
        setValidationError(error.message || "An unexpected error occurred.");
    } finally {
        console.log("Form submission process ended.");
        setIsSubmitting(false);
    }
};

// Helper function to construct token data
const constructTokenData = ({ token_name, token_symbol, decimals, total_supply, ownerPrincipal }) => ({
    token_name: token_name.toLowerCase(),
    token_symbol,
    decimals: [parseInt(decimals, 10)],
    initial_balances: [
        [
            {
                owner: ownerPrincipal,
                subaccount: [],
            },
            BigInt(total_supply),
        ],
    ],
});

// Helper function to set up HttpAgent
const setupHttpAgent = async ({ isLocalNetwork }) => {
    const agent = new HttpAgent({ identity, host: HOST });
    if (isLocalNetwork) {
        console.log("Fetching root key for local development...");
        await agent.fetchRootKey();
    }
    return agent;
};

// Helper function to create ledger actor
const createLedgerActor = (agent) =>
    Actor.createActor(ledgerIDL, {
        agent,
        canisterId:  "ryjl3-tyaaa-aaaaa-aaaba-cai",
    });

// Helper function to prepare ICRC2 approve arguments
const prepareICRC2ApproveArgs = (spenderCanisterId, amount) => ({
    from_subaccount: [],
    spender: {
        owner: Principal.fromText(spenderCanisterId),
        subaccount: [],
    },
    fee: [],
    memo: [],
    amount,
    created_at_time: [],
    expected_allowance: [],
    expires_at: [],
});

// Helper function to handle ICRC2 approval and token creation
const handleICRC2ApprovalAndTokenCreation = async ({ ledgerActor, icrc2ApproveArgs, actor, ownerPrincipal, tokenData, formData }) => {
    console.log("Calling ICRC2 approve...");
    const approveResponse = await ledgerActor.icrc2_approve(icrc2ApproveArgs);
    console.log("ICRC2 approve response:", approveResponse);

    if (approveResponse && !approveResponse?.Err) {
        console.log("ICRC2 approve successful. Initiating fee transfer...");
        const feeResponse = await actor.token_fee_transfer(ownerPrincipal, icrc2ApproveArgs.amount, ledgerActor);
        console.log("Fee transfer response:", feeResponse);

        if (feeResponse && !feeResponse?.Err) {
            const response = await actor.create_token(tokenData);
            handleTokenCreationResponse(response, formData);
        } else {
            throw new Error(`ICRC2 fee Transfer failed: ${feeResponse?.Err}`);
        }
    } else {
        throw new Error(`ICRC2 approval failed: ${approveResponse?.Err}`);
        // console.log(`ICRC2 approval failed: ${approveResponse?.Err}`)
    }
};

// Helper function to handle token creation response
const handleTokenCreationResponse = (response, formData) => {
    if (response && response.Ok) {
        const { ledger_canister_id, index_canister_id } = response.Ok;
        console.log("Token created successfully. Navigating to verify-token...");
        navigate("/verify-token", {
            state: {
                formData,
                ledger_canister_id: ledger_canister_id._arr,
                index_canister_id,
            },
        });
    } else {
        console.error("Token creation failed:", response);
        setValidationError("Token creation failed.");
    }
};



useLayoutEffect(() => {
  if (modalIsOpen) {
    document.body.classList.add("overflow-hidden"); 
  } else {
    document.body.classList.remove("overflow-hidden");
  }
  return () => {
    document.body.classList.remove("overflow-hidden");
  };
}, [modalIsOpen]);

  return (
    <div className="absolute">
    <Modal
             isOpen={modalIsOpen}
             onRequestClose={closeModal}
             contentLabel="Create Token Modal"
             className={`fixed inset-0 flex  items-center justify-center bg-transparent`}
             overlayClassName={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
                 isVisible ? 'opacity-100' : 'opacity-0'
             }`}
             ariaHideApp={false}
         >
             <div
                 className={`bg-[#222222] p-6 rounded-2xl text-white max-h-[90vh] overflow-y-auto no-scrollbar w-[786px] relative transform transition-all duration-300 ${
                     isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                 }`}>
                 <div className=" px-4 py-1 mb-4 rounded-2xl relative">
            <div className="bg-[#FFFFFF4D] mx-[-24px]  px-4 py-1 mb-4 rounded-2xl">
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

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Token Name */}
              <div className="mb-4">
                <label className="block mb-2 text-[18px]">Name</label>
                <input
                  type="text"
                  {...register("token_name")}
                  className={`w-full p-2 bg-[#444444] text-white rounded-3xl outline-none 
                    ${errors.token_name ? "border-red-500" : "border-white"
                    } border-b-2`}
                />
                {errors.token_name && (
                  <p className="mt-1 text-sm text-red-500  flex justify-start">{errors.token_name.message}</p>
                )}
              </div>

              {/* Token Symbol */}
              <div className="mb-4">
                <label className="block mb-2 text-[18px]">Symbol</label>
                <input
                  type="text"
                  {...register("token_symbol")}
                  className={`w-full p-2 bg-[#444444] text-white rounded-3xl outline-none 
  ${errors.token_symbol ? "border-red-500" : "border-white"} border-b-2`}
                />
                {errors.token_symbol && (
                  <p className="mt-1 text-sm text-red-500  flex justify-start">{errors.token_symbol.message}</p>
                )}
              </div>

              {/* Token Decimals */}
              <div className="mb-4">
                <label className="block mb-2 text-[18px]">Decimals</label>
                <input
                  type="number"
                  {...register("decimals")}
                  className={`w-full p-2 bg-[#444444] text-white rounded-3xl outline-none no-spinner
                    ${errors.decimals ? "border-red-500" : "border-white"
                    } border-b-2`}
                />
                {errors.decimals && (
                  <p className="mt-1 text-sm text-red-500  flex justify-start">{errors.decimals.message}</p>
                )}
              </div>

              {/* Total Supply */}
              <div className="mb-4">
                <label className="block mb-2 text-[18px]">Total Supply</label>
                <input
                  type="number"
                  {...register("total_supply")}
                  className={`w-full p-2 bg-[#444444] text-white rounded-3xl outline-none no-spinner
                    ${errors.total_supply ? "border-red-500" : "border-white"
                    } border-b-2`}
                />
                {errors.total_supply && (
                  <p className="mt-1 text-sm  text-red-500  flex justify-start">{errors.total_supply.message}</p>
                )}
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
                  className={`w-4 h-4 border-2 flex items-center mt-1 justify-center rounded-sm mr-2 cursor-pointer ${termsAccepted ? "" : "border-white bg-transparent"
                    }`}
                >
                  <label
                    htmlFor="termsCheckbox"
                    className="cursor-pointer w-full h-full flex items-center justify-center"
                  >
                    {termsAccepted && <span className="text-[#F3B3A7]">✓</span>}
                  </label>
                </div>
                <label className="text-[15px] text-[#cccccc]" htmlFor="termsCheckbox">
                  By creating this token, I agree to the terms and conditions.
                </label>
              </div>

              {/* Validation Error Message */}
              {validationError && (
                <p className="text-red-500 mb-4">{validationError}</p>
              )}
              {/* Create Token Button */}
              <div className="flex justify-center items-center">
                <AnimationButton
                  text="CREATE TOKEN"
                  type="submit"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  isDisabled={isSubmitting}
                />
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateTokenModal;