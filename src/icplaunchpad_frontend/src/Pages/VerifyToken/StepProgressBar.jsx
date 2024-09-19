import React from 'react';

const StepProgressBar = ({ currentStep }) => {
  const steps = ['Verify Token', 'Launchpad Info', 'Add Additional Information', 'Review Information'];

  return (
    <div className="flex justify-between items-center w-[864px] py-11 relative">
      {steps.map((step, index) => (
        <div className="flex  items-center relative w-full" key={index}>
          <div className="  flex flex-col items-center  ">
            {/* Step circle */}
            <div
              className={`flex items-center justify-center w-11 h-11 rounded-full z-10 ${
                currentStep === index + 1
                  ? 'bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-black'
                  : 'border border-[#F3B3A7] bg-black text-white'
              }`}
            >
              {currentStep > index + 1 ? (
                <img src="check.svg" alt="Completed" />
              ) : (
                <h1>{index + 1}</h1>
              )}
            </div>

            {/* Step label */}
            <div className="ml-2 mt-3 text-center text-sm">{step}</div>
          </div>

          {/* Connectors between steps */}
          {index < steps.length - 1 && (
            <div className="absolute top-5   left-16  flex items-center w-full">
              <div
                className={`h-[2px] w-full ${
                  currentStep > index + 1 ? 'bg-[#F3B3A7]' : 'bg-gray-500'
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepProgressBar;
