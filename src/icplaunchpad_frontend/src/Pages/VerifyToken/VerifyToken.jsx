import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import VerifyTokenTab from "./Tabs/VerifyTokenTab";
import LaunchpadInfoTab from "./Tabs/LaunchpadInfoTab";
import AdditionalInfoTab from "./Tabs/AdditionalInfoTab";
import ReviewInfoTab from "./Tabs/ReviewInfoTab";
import StepProgressBar from "./StepProgressBar";
import { Principal } from "@dfinity/principal";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { SetLedgerIdHandler } from "../../StateManagement/Redux/Reducers/LedgerId";
import { upcomingSalesHandlerRequest } from "../../StateManagement/Redux/Reducers/UpcomingSales";
import { SuccessfulSalesHandlerRequest } from "../../StateManagement/Redux/Reducers/SuccessfulSales";
import { SaleParamsHandlerRequest } from "../../StateManagement/Redux/Reducers/SaleParams";
import { getSchemaForStep } from "../../common/Validations/TokensValidation";
import compressImage from "../../utils/CompressedImage";
import { toast, Toaster } from "react-hot-toast";
import { UserTokensInfoHandlerRequest } from "../../StateManagement/Redux/Reducers/UserTokensInfo";
import { Actor } from "@dfinity/agent";
import timestampAgo, { getExpirationTimeInMicroseconds } from "../../utils/timeStampAgo";
import { useBlocker } from "../../common/NavigationBlocker";


const convertFileToBytes = async (file) => {
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    return Array.from(new Uint8Array(arrayBuffer));
  }
  return null;
};
const VerifyToken = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tokenData, setTokenData] = useState({});
  const [presaleDetails, setPresaleDetails] = useState({ social_links: [] });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [tokenApproved, setTokenApproved] = useState(null);
  const { formData, ledger_canister_id, index_canister_id } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  // console.log('ledger_canister_id verify', Principal.fromUint8Array(ledger_canister_id))
  const principal = useSelector((currState) => currState.internet.principal);

  //  useBlocker(
  //   ({ action, location }) => {
  //     if (isSubmitting || currentStep < 4) {
  //       return window.confirm("You have unsaved changes. Are you sure you want to leave?");
  //     }
  //     return true;
  //   },
  //   true // Enable blocking
  // );

  useEffect(() => {
    if (formData)
      setTokenData(formData)
  }, [formData])

  console.log('tokenData', tokenData)
  const {
    register,
    unregister,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getSchemaForStep(currentStep)),
    mode: "all",
    defaultValues: {
      FairlaunchTokens: presaleDetails.FairlaunchTokens || "",
      minimumBuy: presaleDetails.minimumBuy || "",
      maximumBuy: presaleDetails.maximumBuy || "",
      startTime: presaleDetails.startTime || "",
      endTime: presaleDetails.endTime || "",
      description: presaleDetails.description || "",
    },
  });

  // console.log("Form validation errors:", errors);

  // Function to submit presale details
  const submitPresaleDetails = async (data) => {
    console.log("Submitting presale details with data:", data);

    try {
      setIsSubmitting(true);
      const {
        token_name = tokenData?.token_name,
        FairlaunchTokens,
        hardcapToken,
        softcapToken,
        minimumBuy,
        maximumBuy,
        tokensLiquidity,
        liquidityPercentage,
        startTime,
        endTime,
        logoURL,
        description,
        social_links,
        project_video,
        coverImageURL,
        website = "",
      } = presaleDetails;

      const start_time_utc = Math.floor(new Date(startTime).getTime() / 1000);
      const end_time_utc = Math.floor(new Date(endTime).getTime() / 1000);
      const TokenPicture = logoURL ? await convertFileToBytes(logoURL) : null;
      const CoverPicture = coverImageURL ? await convertFileToBytes(coverImageURL) : null;
      const creatorPrincipal =
        typeof principal === "string"
          ? Principal.fromText(principal)
          : principal;

      const presaleData = {
        creator: creatorPrincipal,
        tokens_for_fairlaunch: parseInt(FairlaunchTokens),
        hardcap: parseInt(hardcapToken),
        softcap: parseInt(softcapToken),
        min_contribution: parseInt(minimumBuy),
        max_contribution: parseInt(maximumBuy),
        start_time_utc,
        end_time_utc,
        tokens_for_liquidity: parseInt(tokensLiquidity),
        liquidity_percentage: parseFloat(liquidityPercentage),
        description,
        social_links,
        website,
        project_video,
      };

      const ledgerPrincipalId =
        typeof ledger_canister_id !== "string" && ledger_canister_id
          ? Principal.fromUint8Array(ledger_canister_id)
          : Principal.fromText(ledger_canister_id);

      if (!ledgerPrincipalId) throw new Error("Invalid ledger canister ID");

      console.log("ledger_canister_id:", ledger_canister_id);

      // Create an array of promises for presale and images
      const promises = [
        actor.create_sale(ledgerPrincipalId, presaleData),
      ];

      if (TokenPicture) {
        promises.push(
          actor.upload_token_image(process.env.CANISTER_ID_IC_ASSET_HANDLER, {
            content: [TokenPicture],
            ledger_id: ledgerPrincipalId,
          })
        );
      }

      if (CoverPicture) {
        promises.push(
          actor.upload_cover_image(process.env.CANISTER_ID_IC_ASSET_HANDLER, {
            content: [CoverPicture],
            ledger_id: ledgerPrincipalId,
          })
        );
      }

      // Execute all promises
      const results = await Promise.allSettled(promises);

      // Handle presale creation response
      const presaleResult = results[0];
      if (presaleResult.status === "rejected" || presaleResult.value?.Err) {
        const errorMsg =
          presaleResult.status === "rejected"
            ? presaleResult.reason || "Unknown error occurred during presale creation."
            : presaleResult.value.Err;
        throw new Error(errorMsg);
      }

      console.log("Presale created successfully:", presaleResult.value.Ok);
      setTokenApproved(presaleResult.value.Ok);

      // Handle token image upload response
      if (TokenPicture) {
        const tokenImageResult = results[1];
        if (tokenImageResult.status === "fulfilled") {
          console.log("Token image uploaded successfully:", tokenImageResult.value);
        } else {
          console.warn("Error uploading token image:", tokenImageResult.reason);
        }
      }

      // Handle cover image upload response
      if (CoverPicture) {
        const coverImageIndex = TokenPicture ? 2 : 1;
        const coverImageResult = results[coverImageIndex];
        if (coverImageResult.status === "fulfilled") {
          console.log("Cover image uploaded successfully:", coverImageResult.value);
        } else {
          console.warn("Error uploading cover image:", coverImageResult.reason);
        }
      }

      // Dispatch necessary actions
      dispatch(
        SetLedgerIdHandler({
          ledger_canister_id: ledgerPrincipalId.toText(),
          index_canister_id: index_canister_id,
        })
      );
      dispatch(upcomingSalesHandlerRequest());
      dispatch(SuccessfulSalesHandlerRequest());
      dispatch(UserTokensInfoHandlerRequest());

      if (process.env.NETWORK === "ic") {
        try {
          const ledgerActor = Actor.createActor(ledgerIDL, {
            agent,
            canisterId: ledger_canister_id.toText(),
          });

          const spenderAccount = {
            owner: Principal.fromText(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND),
            subaccount: [],
          };

          const expiresAtTimeInMicroseconds = getExpirationTimeInMicroseconds(10);
          const creationTimeInMicroseconds = timestampAgo(BigInt(Date.now()) * 1000n);
          const Amount = BigInt(Math.round(tokenApproved * 10 ** tokenData?.decimals));
          const feeAmount = BigInt(Math.round(0.0001 * 10 ** 8) + 10000);

          const icrc2ApproveArgs = {
            from_subaccount: [],
            spender: spenderAccount,
            fee: [Amount],
            memo: [],
            amount: feeAmount,
            created_at_time: [creationTimeInMicroseconds],
            expected_allowance: [feeAmount],
            expires_at: [expiresAtTimeInMicroseconds],
          };

          const approveResponse = await ledgerActor.icrc2_approve(icrc2ApproveArgs);
          console.log("ICRC2 approve response:", approveResponse);

          if (approveResponse?.Err) {
            throw new Error(`ICRC2 approval failed: ${approveResponse.Err}`);
          }

          toast.success("ICRC2 approval successful.");
        } catch (approvalError) {
          console.error("ICRC2 approval failed:", approvalError);
          toast.error("ICRC2 approval failed. Please check the network or parameters.");
        }
      }
       
      //navigate to token page
      navigate("/token-page", { state: { projectData: {canister_id: ledger_canister_id } } });

    } catch (error) {
      console.error("Submission failed with error:", error);
      setError(error.toString());
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleNext = handleSubmit((data) => {
    console.log("Step form data:", data);

    // Merge current step data into presaleDetails
    setPresaleDetails((prev) => ({
      ...prev,
      ...data,
      ...tokenData, // Ensure tokenData values are also included
    }));

    // Debug logs for validation
    console.log("Moving to the next step:", currentStep);

    // Proceed to the next step or submit
    if (currentStep < 4) {
      setError(""); // Clear any previous errors
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      submitPresaleDetails(data);
    }
  });


  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <StepProgressBar currentStep={currentStep} />
      <div className="w-full max-w-[1070px] mt-8">
        {currentStep === 1 && (
          <VerifyTokenTab
            register={register}
            tokenData={tokenData}
            setTokenData={setTokenData}
            ledger_canister_id={ledger_canister_id && ledger_canister_id}
            setPresaleDetails={setPresaleDetails}
            presaleDetails={presaleDetails}
            errors={errors}
            watch={watch}
          />
        )}
        {currentStep === 2 && (
          <LaunchpadInfoTab
            register={register}
            setPresaleDetails={setPresaleDetails}
            presaleDetails={presaleDetails}
            errors={errors}
            watch={watch}
          />
        )}
        {currentStep === 3 && (
          <AdditionalInfoTab
            register={register}
            unregister={unregister}
            control={control}
            presaleDetails={presaleDetails}
            setPresaleDetails={setPresaleDetails}
            errors={errors}
          />
        )}
        {currentStep === 4 && <ReviewInfoTab presaleDetails={presaleDetails} />}
      </div>

      <div className="flex justify-between max-w-2xl  font-posterama mt-[-120px]  dxs:mt-[-190px] xxs1:mt-[-130px] sm2:mt-[-120px] md:mt-[-80px] lg:mt-[-80px]">
        {currentStep > 1 && (
          <button
            className="bg-transparent font-posterama border-2 w-[80px] ss2:w-[115px] sm4:w-[210px] h-[35px] mx-2 text-[17px] font-[400] rounded-2xl"
            onClick={handleBack}
          >
            <div className="w-full h-full rounded-xl mt-[2px] bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-transparent bg-clip-text">
              Back
            </div>
          </button>
        )}
        {currentStep <= 4 && (
          <button
            className="border-1 flex justify-center items-center bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-black w-[80px] ss2:w-[115px] sm4:w-[210px]  h-[35px] text-[17px] font-[600] rounded-2xl"
            onClick={() => {
              handleNext();
            }}
            disabled={isSubmitting}

          >
            {/* {currentStep === 4 ? "Submit" : "Next"} */}
            {isSubmitting ? (
              <ThreeDots
                visible={true}
                height="35"
                width="35"
                color="#FFFEFF"
                radius="9"
                ariaLabel="three-dots-loading"
              />
            ) : currentStep === 4 ? (
              "Submit"
            ) : (
              "Next"
            )}
          </button>
        )}
      </div>

      <Toaster />
    </div>
  );
};

export default VerifyToken;