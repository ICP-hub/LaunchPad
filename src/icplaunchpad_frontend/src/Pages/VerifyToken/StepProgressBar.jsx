import React from 'react';

const StepProgressBar = ({ currentStep }) => {
  const steps = ['Verify Token', 'Launchpad Info', 'Add Additional Information', 'Review Information'];

  return (
    <div className="flex justify-between items-center w-[864px] py-11 ">
      {steps.map((step, index) => (
        <div className="flex items-center w-full" key={index}>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= index + 1
                ? 'bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-black'
                : 'border border-gradient text-white'
            }`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 border-t-2 ${
                currentStep > index + 1 ? 'border-gradient' : 'border-gray-500'
              } mx-2`}
            />
          )}
          <div className="ml-2">{step}</div>
        </div>
      ))}
    </div>
  );
};

export default StepProgressBar;
