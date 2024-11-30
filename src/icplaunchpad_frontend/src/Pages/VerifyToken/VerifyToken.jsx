

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
import { getSchemaForStep } from "../../common/TokensValidation";
import compressImage from "../../utils/CompressedImage";


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
  const { formData, ledger_canister_id, index_canister_id } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const principal = useSelector((currState) => currState.internet.principal);
  useEffect(() => {
    if (formData)
      setTokenData(formData)
  }, [formData])

  const {
    register,
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

  console.log("Form validation errors:", errors);

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
      const TokenPicture = await convertFileToBytes(logoURL);
      const CoverPicture = await convertFileToBytes(coverImageURL);
      const creatorPrincipal =
        typeof principal === "string"
          ? Principal.fromText(principal)
          : principal;

      const socialLinksURLs = social_links.map((link) => link.url);

      const presaleData = {
        creator: creatorPrincipal,
        tokens_for_fairlaunch: parseInt(FairlaunchTokens),
        hardcap:parseInt(hardcapToken),
        softcap:parseInt(softcapToken),
        min_contribution: parseInt(minimumBuy),
        max_contribution: parseInt(maximumBuy),
        start_time_utc,
        end_time_utc,
        tokens_for_liquidity:parseInt(tokensLiquidity),
        liquidity_percentage:parseFloat(liquidityPercentage),
        description,
        social_links: socialLinksURLs,
        website,
        project_video,
        processed:true
      };

      const ledgerPrincipalId = typeof ledger_canister_id !== 'string' && ledger_canister_id
        ? Principal.fromUint8Array(ledger_canister_id)
        : Principal.fromText(ledger_canister_id)

      if (!ledgerPrincipalId) throw new Error("Invalid ledger canister ID");

      const response = await actor.create_sale(ledgerPrincipalId, presaleData);

      if (response.Err) throw new Error(response.Err);

      if (TokenPicture) {
       
        const imgUrl = {
          content: [TokenPicture],
          ledger_id: ledgerPrincipalId,
        };
        const res = await actor.upload_token_image("br5f7-7uaaa-aaaaa-qaaca-cai", imgUrl);
        console.log("uploaded img response ", res)
      }

      if (CoverPicture) {
       
        const imgUrl_cover = {
          content: [CoverPicture],
          ledger_id: ledgerPrincipalId,
        };
        const res = await actor.upload_cover_image("br5f7-7uaaa-aaaaa-qaaca-cai", imgUrl_cover);
        console.log("uploaded cover img response ", res)
      }

      console.log("Submission successful");

      // adding ledger_canister_id and index_canister_id in redux store   
      dispatch(
        SetLedgerIdHandler({
          ledger_canister_id: ledgerPrincipalId.toText(),
          index_canister_id: index_canister_id,
        })
      );

      // for rerendering the tokens 
      // SaleParamsHandlerRequest()
      dispatch(upcomingSalesHandlerRequest());
      dispatch(SuccessfulSalesHandlerRequest());

      navigate("/token-page", { state: { ledger_canister_id } });
    } catch (error) {
      console.error("Submission failed with error:", error);
      setError(
        "An error occurred while submitting the presale details. Please try again."
      );
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
              disabled = { isSubmitting }
            }}
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
      {error && <div className= " text-red-500 mt-8 px-8">{error}</div>}
    </div>
  );
};

export default VerifyToken;