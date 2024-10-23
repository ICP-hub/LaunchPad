
// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import VerifyTokenTab from "./Tabs/VerifyTokenTab";
// import LaunchpadInfoTab from "./Tabs/LaunchpadInfoTab";
// import AdditionalInfoTab from "./Tabs/AdditionalInfoTab";
// import ReviewInfoTab from "./Tabs/ReviewInfoTab";
// import StepProgressBar from "./StepProgressBar";
// import { useAuth } from "../../StateManagement/useContext/useAuth";
// import { Principal } from "@dfinity/principal";

// // Utility function to convert an image file to a byte array
// const convertFileToBytes = async (file) => {
//   if (file) {
//     const arrayBuffer = await file.arrayBuffer();
//     return Array.from(new Uint8Array(arrayBuffer));
//   }
//   return null;
// };

// const VerifyToken = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [presaleDetails, setPresaleDetails] = useState({ social_links: [] });
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { formData, ledger_canister_id } = location.state || {};
//   const { actor, principal } = useAuth();

//   // Function to set social links in presaleDetails
//   const setSocialLinks = (socialLinks) => {
//     setPresaleDetails((prevDetails) => ({
//       ...prevDetails,
//       social_links: socialLinks,
//     }));
//   };

//   const validateTimes = (startTime, endTime) => {
//     if (endTime < startTime) {
//       setError("Start time should be less than end time.");
//       return false;
//     }
//     setError("");
//     return true;
//   };

//  const submitPresaleDetails = async () => {
//    try {
//      const {
//        presaleRate,
//        minimumBuy,
//        maximumBuy,
//        startTime,
//        endTime,
//        logoURL,
//        description,
//        social_links,
//        website = "", // Ensure website has a default value
//      } = presaleDetails;

//      const start_time_utc = Math.floor(new Date(startTime).getTime() / 1000);
//      const end_time_utc = Math.floor(new Date(endTime).getTime() / 1000);
//      const TokenPicture = await convertFileToBytes(logoURL);
//      const creatorPrincipal =
//        typeof principal === "string"
//          ? Principal.fromText(principal)
//          : principal;

//      // Map social_links to contain only URLs
//      const socialLinksURLs = social_links.map((link) => link.url);

//      const presaleData = {
//        listing_rate: parseFloat(presaleRate) || 0.4,
//        min_buy: parseInt(minimumBuy),
//        max_buy: parseInt(maximumBuy),
//        start_time_utc,
//        end_time_utc,
//        description,
//        creator: creatorPrincipal,
//        social_links: socialLinksURLs,
//        website,
//      };

//      console.log("Presale Data:", presaleData);

//      const ledgerPrincipalId = ledger_canister_id
//        ? Principal.fromUint8Array(ledger_canister_id)
//        : null;
//      if (!ledgerPrincipalId) {
//        console.error("Invalid ledger canister ID:", ledger_canister_id);
//        throw new Error("Invalid ledger canister ID");
//      }

//      const response = await actor.create_sale(ledgerPrincipalId, presaleData);

//      if (response.Err) {
//        console.error("Actor Error:", response.Err);
//        throw new Error(response.Err);
//      }

//      if (!response.Err && TokenPicture) {
//        const imgUrl = { content: [TokenPicture], ledger_id: ledgerPrincipalId };
//        await actor.upload_token_image("br5f7-7uaaa-aaaaa-qaaca-cai", imgUrl);
//      }

//      navigate("/token-page", { state: { ledger_canister_id } });
//    } catch (error) {
//      console.error("Error details:", error);
//      setError(
//        "An error occurred while submitting the presale details. Please try again."
//      );
//    }
//  };


//   const handleNext = () => {
//     if (currentStep < 4) {
//       if (currentStep === 2) {
//         if (!validateTimes(presaleDetails?.startTime, presaleDetails?.endTime))
//           return;
//       }
//       setCurrentStep((prevStep) => prevStep + 1);
//       if (currentStep === 1)
//         setPresaleDetails((prev) => ({ ...prev, ...formData }));
//     } else if (currentStep === 4) {
//       submitPresaleDetails();
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) setCurrentStep((prevStep) => prevStep - 1);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
//       <StepProgressBar currentStep={currentStep} />
//       <div className="w-full max-w-[1070px] mt-8">
//         {currentStep === 1 && (
//           <VerifyTokenTab
//             tokenData={formData}
//             setPresaleDetails={setPresaleDetails}
//             presaleDetails={presaleDetails}
//           />
//         )}
//         {currentStep === 2 && (
//           <LaunchpadInfoTab
//             setPresaleDetails={setPresaleDetails}
//             presaleDetails={presaleDetails}
//           />
//         )}
//         {currentStep === 3 && (
//           <AdditionalInfoTab
//             setPresaleDetails={setPresaleDetails}
//             presaleDetails={presaleDetails}
//             setSocialLinks={setSocialLinks} // Pass down setSocialLinks
//           />
//         )}
//         {currentStep === 4 && <ReviewInfoTab presaleDetails={presaleDetails} />}
//       </div>

//       <div className="flex justify-between max-w-2xl mt-4">
//         {currentStep > 1 && (
//           <button
//             className="bg-transparent font-posterama border-2 w-[80px] h-[35px] mx-2 text-[17px] font-[400] rounded-2xl"
//             onClick={handleBack}
//           >
//             <div className="w-full h-full rounded-xl bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-transparent bg-clip-text">
//               Back
//             </div>
//           </button>
//         )}
//         {currentStep <= 4 && (
//           <button
//             className="border-1 bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-black w-[80px] h-[35px] text-[17px] font-[600] rounded-2xl"
//             onClick={handleNext}
//           >
//             {currentStep === 4 ? "Submit" : "Next"}
//           </button>
//         )}
//       </div>
//       {error && <div className="text-red-500 mt-4 px-8">{error}</div>}
//     </div>
//   );
// };

// export default VerifyToken;



import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import VerifyTokenTab from "./Tabs/VerifyTokenTab";
import LaunchpadInfoTab from "./Tabs/LaunchpadInfoTab";
import AdditionalInfoTab from "./Tabs/AdditionalInfoTab";
import ReviewInfoTab from "./Tabs/ReviewInfoTab";
import StepProgressBar from "./StepProgressBar";
import { useAuth } from "../../StateManagement/useContext/useAuth";
import { Principal } from "@dfinity/principal";

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
          .positive("Minimum buy must be positive"),
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
          .min(yup.ref("startTime"), "End time should be after the start time"),
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
  const [presaleDetails, setPresaleDetails] = useState({ social_links: [] });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { actor, principal } = useAuth();
  const { formData, ledger_canister_id } = location.state || {};

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
      const {
        presaleRate,
        minimumBuy,
        maximumBuy,
        startTime,
        endTime,
        logoURL,
        description,
        social_links,
        website = "",
      } = presaleDetails;

      const start_time_utc = Math.floor(new Date(startTime).getTime() / 1000);
      const end_time_utc = Math.floor(new Date(endTime).getTime() / 1000);
      const TokenPicture = await convertFileToBytes(logoURL);
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
      };

      const ledgerPrincipalId = ledger_canister_id
        ? Principal.fromUint8Array(ledger_canister_id)
        : null;
      if (!ledgerPrincipalId) throw new Error("Invalid ledger canister ID");

      const response = await actor.create_sale(ledgerPrincipalId, presaleData);

      if (response.Err) throw new Error(response.Err);

      if (TokenPicture) {
        const imgUrl = {
          content: [TokenPicture],
          ledger_id: ledgerPrincipalId,
        };
        await actor.upload_token_image("br5f7-7uaaa-aaaaa-qaaca-cai", imgUrl);
      }
 console.log("Submission successful");
      navigate("/token-page", { state: { ledger_canister_id } });
    } catch (error) {
            console.error("Submission failed with error:", error); 
      setError(
        "An error occurred while submitting the presale details. Please try again."
      );
    }
  };


  const handleNext = handleSubmit((data) => {
    console.log("Step form data:", data);
    setPresaleDetails((prev) => ({
      ...prev,
      ...data,
      ...formData,
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
            tokenData={formData}
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
            className="border-1 bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-black w-[80px]  ss2:w-[115px] sm4:w-[210px] h-[35px] text-[17px] font-[600] rounded-2xl"
            onClick={() => {
              console.log("Next button clicked"); 
              handleNext();
            }}
          >
            {currentStep === 4 ? "Submit" : "Next"}
          </button>
        )}
      </div>
      {error && <div className="text-red-500 mt-4 px-8">{error}</div>}
    </div>
  );
};

export default VerifyToken;
