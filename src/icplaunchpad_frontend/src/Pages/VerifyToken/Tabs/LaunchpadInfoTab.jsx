import React from 'react';

const LaunchpadInfoTab = () => {
  return (
    <div className="bg-[#222222] p-8  rounded-md h-[730px] shadow-lg">
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
        <div className="flex items-center mb-4">
          <label className="flex items-center mr-4">
            <input type="radio" name="whitelist" className="mr-4" />
            Disable
          </label>
          <label className="flex items-center">
            <input type="radio" name="whitelist" className="mr-4" />
            Enable
          </label>
        </div>
        <p className=" text-xs">Toggle whitelist on/off anytime.</p>
      </div>

      <div className="flex justify-between mb-4">
        <div className="w-1/2 pr-2">
          <label className="block text-[19px]  mb-1">Minimum Buy</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-[19px]  mb-1">Maximum Buy</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
      </div>

      <div className="flex justify-between mb-8">
        <div className="w-1/2 pr-2">
          <label className="block text-[19px] mb-1">Start Time</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className="w-1/2 pl-2">
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
