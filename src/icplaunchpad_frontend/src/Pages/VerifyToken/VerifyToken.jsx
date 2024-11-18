

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
// Validation schema using Yup
const getSchemaForStep = (step) => {
  switch (step) {
    case 2:
      return yup.object().shape({
        presaleRate: yup
          .number()
          .required("Presale rate is required")
          .positive("Presale rate must be positive")
          .notOneOf([0], "Presale rate cannot be 0"),
        minimumBuy: yup
          .number()
          .required("Minimum buy is required")
          .positive("Minimum buy must be positive")
          .notOneOf([0], "Minimum buy cannot be 0"),
        maximumBuy: yup
          .number()
          .required("Maximum buy is required")
          .positive("Maximum buy must be positive")
          .notOneOf([0], "Maximum buy cannot be 0")
          .moreThan(
            yup.ref("minimumBuy"),
            "Maximum buy must be greater than minimum buy"
          ),
        startTime: yup
          .date()
          .required("Start time is required")
          .min(new Date(), "Start time must be in the future"),
        endTime: yup
          .date()
          .required("End time is required")
          .min(
            yup.ref("startTime"),
            "End time should be after the start time"
          )
          .test(
            "is-at-least-one-minute-later",
            "End time should be at least one minute after the start time",
            function (value) {
              const { startTime } = this.parent;
              if (startTime && value) {
                return value.getTime() >= new Date(startTime).getTime() + 60000;
              }
              return true;
            }
          ),
        social_links: yup
          .array()
          .of(
            yup.object().shape({
              link: yup
                .string()
                .test(
                  'no-leading-trailing-spaces',
                  'URL should not have leading or trailing spaces',
                  (value) => {
                    return value === value?.trim();
                  }
                )
                .test(
                  'no-invalid-extensions',
                  'URL should not end with .php, .js, or .txt',
                  (value) => {
                    const invalidExtensions = ['.php', '.js', '.txt'];
                    return value
                      ? !invalidExtensions.some((ext) => value.endsWith(ext))
                      : true;
                  }
                )
                .test('is-website', 'Only website links are allowed', (value) => {
                  if (value) {
                    try {
                      const url = new URL(value);
                      const hostname = url.hostname.toLowerCase();
                      const validExtensions = [
                        '.com',
                        '.org',
                        '.net',
                        '.in',
                        '.co',
                        '.io',
                        '.gov',
                      ];
                      const hasValidExtension = validExtensions.some((ext) =>
                        hostname.endsWith(ext)
                      );
                      return hasValidExtension;
                    } catch (err) {
                      return false;
                    }
                  }
                  return true;
                })
                .url('Invalid URL')
                .nullable(true)
                .optional(),
            })
          )
          .max(10, 'You can only add up to 10 links') // Restrict the array to a maximum of 10 links
          .optional(),
        // Image Validation
        logoURL: yup
          .mixed()
          .nullable(false)
          .test("fileSize", "File size max 10MB allowed", (value) => {
            return !value || (value && value.size <= 10 * 1024 * 1024);
          })
          .test("fileType", "Only jpeg, jpg & png file format allowed", (value) => {
            return (
              !value ||
              (value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
            );
          }),
      });
    case 3:
      return yup.object().shape({
        description: yup
          .string()
          .required("Description is required")
          .test(
            "wordCount",
            "Description must be 300 words or less",
            (value) => value && value.split(" ").length <= 300
          ),
      });
    default:
      return yup.object().shape({});
  }
};



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
      presaleRate: presaleDetails.presaleRate || "",
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
        presaleRate,
        minimumBuy,
        maximumBuy,
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
        listing_rate: parseFloat(presaleRate) || 0.4,
        min_buy: parseInt(minimumBuy),
        max_buy: parseInt(maximumBuy),
        start_time_utc,
        end_time_utc,
        description,
        creator: creatorPrincipal,
        social_links: socialLinksURLs,
        website,
        project_video,

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
        const imgUrl = {
          content: [CoverPicture],
          ledger_id: ledgerPrincipalId,
        };
        const res = await actor.upload_cover_image("br5f7-7uaaa-aaaaa-qaaca-cai", imgUrl);
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
    setPresaleDetails((prev) => ({
      ...prev,
      ...data,
      ...tokenData,
    }));
    console.log("Moving to the next step:", currentStep);
    if (currentStep < 4) {
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

      <div className="flex justify-between max-w-2xl font-posterama mt-[-120px]  dxs:mt-[-190px] xxs1:mt-[-130px] sm2:mt-[-120px] md:mt-[-70px]">
        {currentStep > 1 && (
          <button
            className="bg-transparent font-posterama border-2 w-[80px] ss2:w-[115px] sm4:w-[210px] h-[35px] mx-2 text-[17px] font-[400] rounded-2xl"
            onClick={handleBack}
          >
            <div className="w-full h-full rounded-xl bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-transparent bg-clip-text">
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
      {error && <div className="text-red-500 mt-8 px-8">{error}</div>}
    </div>
  );
};

export default VerifyToken;