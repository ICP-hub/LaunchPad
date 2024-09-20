import React from 'react';

const LaunchpadInfoTab = () => {
  return (
    <div className="bg-[#222222] p-8  m-[18px] mb-[115px] xxs1:mb-[60px] sm2:mb-[30px] md:m-4  rounded-2xl  xxs1:h-[730px] ">
      {/* Chain Text with Gray Background on mobile only*/}
      <div className="flex  xxs1:hidden mb-8 bg-[rgb(68,68,68)] pl-6 p-2 mt-[-31px] mx-[-31px] rounded-2xl">
            <span className="text-white text-[22px]">Chain</span>
          </div>
      <div className="mb-4">
        <label className="block text-[19px] mb-2">Presale Rate</label>
        <input
          type="text"
          className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-[19px] mb-2">Hardcap Token</label>
        <input
          type="text"
          className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
        />
      </div>

      <div className="mb-8">
        <label className="block text-[19px] mb-2">Softcap Token</label>
        <input
          type="text"
          className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-[19px]  mb-1">Whitelist</label>
        <div className="flex items-center mb-4 gap-4">
        <label className="flex items-center">
  <input type="radio" name="currency" className="hidden peer" />
  <div className="w-4 h-4 bg-transparent border-2 border-white  rounded-full  peer-checked:bg-gradient-to-r from-[#f09787]  to-[#CACCF5] flex items-center justify-center mr-2">
      <div className="w-1.5 h-1.5 bg-transparent peer-checked:bg-gradient-to-r from-[#f09787]  to-[#CACCF5] rounded-full"></div>
  </div>
  Disable
</label>
          <label className="flex items-center">
  <input type="radio" name="currency" className="hidden peer" />
  <div className="w-4 h-4 bg-transparent border-2 border-white  rounded-full  peer-checked:bg-gradient-to-r from-[#f09787]  to-[#CACCF5] flex items-center justify-center mr-2">
      <div className="w-1.5 h-1.5 bg-transparent peer-checked:bg-gradient-to-r from-[#f09787]  to-[#CACCF5] rounded-full"></div>
  </div>
   Enable
</label>
        </div>
        <p className=" text-xs">Toggle whitelist on/off anytime.</p>
      </div>

      <div className="flex flex-col  xxs1:flex-row  justify-between mb-4">
        <div className="  xxs1:w-1/2 pr-2 mb-6">
          <label className="block text-[19px]  mb-1">Minimum Buy</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className=" w-full xxs1:w-1/2 xxs1:pl-2 mb-6">
          <label className="block text-[19px]  mb-1">Maximum Buy</label>
          <input
            type="text"
            className="w-full  p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
      </div>

      <div className="flex  flex-col  xxs1:flex-row justify-between mb-[50px] xxs1:mb-8">
        <div className="w-full xxs1:w-1/2 pr-2 mb-6">
          <label className="block text-[19px] mb-1">Start Time</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className=" w-full xxs1:w-1/2 xxs1:pl-2 mb-6">
          <label className="block text-[19px]  mb-1">End Time</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
      </div>
    </div>
  );
};

export default LaunchpadInfoTab;
