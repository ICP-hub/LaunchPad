import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VerifyTokenTab from './Tabs/VerifyTokenTab';
import LaunchpadInfoTab from './Tabs/LaunchpadInfoTab';
import AdditionalInfoTab from './Tabs/AdditionalInfoTab';
import ReviewInfoTab from './Tabs/ReviewInfoTab';
import StepProgressBar from './StepProgressBar';
import { useAuth } from '../../auth/useAuthClient';
import { Principal } from '@dfinity/principal';

// Utility function to convert an image file to a byte array
const convertFileToBytes = async (file) => {
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    return Array.from(new Uint8Array(arrayBuffer));
  }
  return null;
};

const VerifyToken = () => {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [presaleDetails, setPresaleDetails] = useState({});
  const [error, setError] = useState(null);

  // React Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token data and ledger canister ID from location state
  const { formData, ledger_canister_id } = location.state || {};

  // Auth context for actor creation
  const { createCustomActor } = useAuth();

  // Function to handle presale submission
  const submitPresaleDetails = async () => {
    try {
      const {
        presaleRate,
        minimumBuy,
        maximumBuy,
        startTime,
        endTime,
        logoURL,
        website,
        facebook,
        twitter,
        github,
        telegram,
        instagram,
        discord,
        reddit,
        youtubeVideo,
        description,
      } = presaleDetails;

      // Convert times to Unix format (u64)
      const start_time_utc = Math.floor(new Date(startTime).getTime() / 1000);
      const end_time_utc = Math.floor(new Date(endTime).getTime() / 1000);

      // Convert logo image to bytes
      const TokenPicture = await convertFileToBytes(logoURL);

      // Prepare presale data
      const presaleData = {
        listing_rate: parseFloat(presaleRate) || parseFloat(0.4),  // f64
        min_buy: parseInt(minimumBuy),          // u64
        max_buy: parseInt(maximumBuy),          // u64
        start_time_utc,
        end_time_utc,
        logo_url: "",
        website,
        facebook,
        twitter,
        github,
        telegram,
        instagram,
        discord,
        reddit,
        youtube_video: youtubeVideo,
        description,
      };

      // Validate and convert ledger_canister_id to Principal
      const ledgerPrincipalId = ledger_canister_id
        ? Principal.fromUint8Array(ledger_canister_id)
        : null;
      if (!ledgerPrincipalId) throw new Error('Invalid ledger canister ID');
      console.log('verify ledgerId--',ledgerPrincipalId, 'presaleData=', presaleData)
      // Create actor and submit presale data
      const actor = createCustomActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND);
      const response = await actor.store_sale_params(ledgerPrincipalId, presaleData);

      // Upload token image if available
      if (!response.Err && TokenPicture) {
        const imgUrl = { content: [TokenPicture], ledger_id: ledgerPrincipalId };
        const responseImg = await actor.upload_token_image("br5f7-7uaaa-aaaaa-qaaca-cai", imgUrl);
        console.log('Token image uploaded:', responseImg);
      }

      if (response.Err) throw new Error(response.Err);
      console.log('Presale data submitted:', response);

      // Navigate to token page on success
       navigate('/token-page', { state: { ledger_canister_id } });

  
    } catch (error) {
      console.error('Error submitting presale data:', error);
      setError('An error occurred while submitting the presale details. Please try again.');
    }
  };

  // Handle step navigation
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prevStep) => prevStep + 1);
      console.log(presaleDetails)
      
      if(currentStep == 1)
          setPresaleDetails(prev => ({ ...prev, ...formData }))

    } else if (currentStep === 4) {
      submitPresaleDetails();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {/* Step Progress Bar */}
      <StepProgressBar currentStep={currentStep} />

      {/* Dynamic Step Content */}
      <div className="w-full max-w-[1070px] mt-8">
        {currentStep === 1 && (
          <VerifyTokenTab tokenData={formData} setPresaleDetails={setPresaleDetails}  presaleDetails={presaleDetails} />
        )}
        {currentStep === 2 && (
          <LaunchpadInfoTab setPresaleDetails={setPresaleDetails} presaleDetails={presaleDetails} />
        )}
        {currentStep === 3 && (
          <AdditionalInfoTab setPresaleDetails={setPresaleDetails} presaleDetails={presaleDetails}  />
        )}
        {currentStep === 4 && (
          <ReviewInfoTab presaleDetails={presaleDetails} />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between max-w-2xl mt-[-160px] xxs1:mt-[-100px] sm2:mt-[-80px]">
        {/* Back Button */}
        {currentStep > 1 && (
          <button
            className="bg-transparent font-posterama border-2 w-[80px] ss2:w-[120px] lg:w-[211px] h-[35px] mx-2 text-[17px] md:text-[18px] font-[400] rounded-2xl"
            onClick={handleBack}
          >
            <div className="w-full h-full rounded-xl bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-transparent bg-clip-text">
              Back
            </div>
          </button>
        )}

        {/* Next/Submit Button */}
        {currentStep <= 4 && (
          <button
            className="border-1 bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-black w-[80px] ss2:w-[120px] lg:w-[211px] h-[35px] text-[17px] md:text-[18px] font-[600] rounded-2xl"
            onClick={handleNext}
          >
            {currentStep === 4 ? 'Submit' : 'Next'}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && <div className="text-red-500 mt-4 px-8 items-center">{error}</div>}
    </div>
  );
};

export default VerifyToken;
