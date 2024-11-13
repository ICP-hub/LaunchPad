
import React, { useState } from "react";
import { TfiClose } from "react-icons/tfi";
import Modal from "react-modal";
import AnimationButton from "../../common/AnimationButton";
import { useNavigate } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SetLedgerIdHandler } from "../../StateManagement/Redux/Reducers/LedgerId";
import { TokensInfoHandlerRequest } from "../../StateManagement/Redux/Reducers/TokensInfo";
import { useAuth } from "../../StateManagement/useContext/useClient";

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
    .max(255, "Decimals must be less than or equal to 255"),
  

  total_supply: yup
    .number()
    .typeError("Total supply must be a number")
    .required("Total supply is required")
    .positive("Total supply must be positive")
    .max(100000, "Total supply cannot exceed 100,000"),
});

const CreateTokenModal = ({ modalIsOpen, setIsOpen }) => {
  const { actor, principal } = useAuth();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [validationError, setValidationError] = useState('');
 console.log("principal aa gya token create", principal)
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(tokenSchema),
  });

  // Close modal handler
  const closeModal = () => {
    setIsOpen(false);
    reset();
  };

  // Form submission handler
  const onSubmit = async (formData) => {
    setValidationError('')
    setIsSubmitting(true);
    try {
    if (!termsAccepted) {
      setValidationError("Please accept the terms and conditions.");
      throw("Please accept the terms and conditions")
    }


      const { token_name, token_symbol, decimals, total_supply } = formData;
      console.log("principal : ",principal?.toText())
      console.log(!principal,typeof principal)
      if (!principal || typeof principal === "string") {
        throw new Error("Invalid principal. Please ensure you are logged in correctly. teri maa ki chut");
      }
      const ownerPrincipal =principal;

      
      const tokenData = {
        token_name:token_name.toLowerCase(),
        token_symbol,
        decimals: [parseInt(decimals)],
        initial_balances: [
          [
            {
              owner: ownerPrincipal, 
              subaccount: [], 
            },
            BigInt(total_supply), 
          ],
        ],
      };

      console.log("Token data:", tokenData);
      const response = await actor.create_token(tokenData);
      console.log("Token created:", response);

      if (response.Ok) {
        dispatch(TokensInfoHandlerRequest());
        dispatch(UserTokensInfoHandlerRequest());

        const { ledger_canister_id, index_canister_id } = response.Ok;
        console.log("ledger_canister_id---",ledger_canister_id,"  ", index_canister_id)
   
        navigate("/verify-token", {
          state: { formData,ledger_canister_id: ledger_canister_id._arr, index_canister_id },
        });
      }
    } catch (err) {
      console.error("Error creating token:", err);
    }
    finally{
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
        ariaHideApp={false}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#222222] p-6 rounded-2xl text-white m-4 w-[786px] relative">
            <div className="bg-[#FFFFFF4D] mx-[-24px] mt-[-25px] px-4 py-1 mb-4 rounded-2xl">
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
                    ${
                      errors.token_name ? "border-red-500" : "border-white"
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
                  className={`w-full p-2 bg-[#444444] text-white rounded-3xl outline-none 
                    ${
                      errors.decimals ? "border-red-500" : "border-white"
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
                  className={`w-full p-2 bg-[#444444] text-white rounded-3xl outline-none 
                    ${
                      errors.total_supply ? "border-red-500" : "border-white"
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
                  className={`w-4 h-4 border-2 flex items-center mt-1 justify-center rounded-sm mr-2 cursor-pointer ${
                    termsAccepted ? "" : "border-white bg-transparent"
                  }`}
                >
                  <label
                    htmlFor="termsCheckbox"
                    className="cursor-pointer w-full h-full flex items-center justify-center"
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
