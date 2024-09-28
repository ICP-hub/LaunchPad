import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VerifyTokenTab from './Tabs/VerifyTokenTab';
import LaunchpadInfoTab from './Tabs/LaunchpadInfoTab';
import AdditionalInfoTab from './Tabs/AdditionalInfoTab';
import ReviewInfoTab from './Tabs/ReviewInfoTab';
import StepProgressBar from './StepProgressBar';


const VerifyToken = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();  // React Router's hook for navigation
  const location = useLocation();

  const { tokenData } = location.state || {}; // Retrieve the passed tokenData

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else if (currentStep === 4) {
      navigate('/token-page');  // Navigate to /project page when current step is 4
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <StepProgressBar currentStep={currentStep} />
      <div className="w-full max-w-[1070px] mt-8">
        {currentStep === 1 && <VerifyTokenTab tokenData={tokenData} />}
        {currentStep === 2 && <LaunchpadInfoTab />}
        {currentStep === 3 && <AdditionalInfoTab />}
        {currentStep === 4 && <ReviewInfoTab />}
      </div>
      <div className="flex justify-between max-w-2xl mt-[-160px] xxs1:mt-[-100px] sm2:mt-[-80px]">
        {currentStep > 1 && (
          <button
            className=' bg-transparent font-posterama  border-2
           relative w-[120px] lg:w-[211px] h-[35px] lg:h-[35px] mx-2 p-[1.5px]
             text-[17px] md:text-[18px] font-[400] rounded-2xl'
            onClick={handleBack}
          >
           <div className=' w-full h-full  rounded-xl items-center justify-center bg-gradient-to-r  from-[#F3B3A7] to-[#CACCF5] text-transparent bg-clip-text  '>
            Back
            </div>
          </button>
        )}
        {currentStep <= 4 && (
          <button
            className='border-1 bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] 
          text-black relative w-[120px] lg:w-[211px] h-[35px] lg:h-[35px]
             text-[17px] md:text-[18px] font-[600] rounded-2xl'
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyToken;
