import React, { useState } from 'react';

const LaunchpadInfoTab = ({ setPresaleDetails }) => {
  const [whiteList, setWhitelist] = useState(false);

  // Handle Whitelist toggle
  const handleWhitelist = (value) => {
    setWhitelist(value);
    setPresaleDetails((prev) => ({ ...prev, whiteList: value }));
  };

  return (
    <div className="bg-[#222222] p-8 m-4 rounded-2xl mb-[115px] xxs1:mb-[60px] sm2:mb-[30px]">
      
      {/* Chain Text with Gray Background on mobile only */}
      <div className="flex xxs1:hidden mb-8 bg-[#444444] pl-6 p-2 mt-[-31px] mx-[-31px] rounded-2xl">
        <span className="text-white text-[22px]">Chain</span>
      </div>

      {/* Presale Rate */}
      <div className="mb-4">
        <label className="block text-[19px] mb-2">Presale Rate</label>
        <input
          type="number"
          onChange={(e) => setPresaleDetails(prev => ({ ...prev, presaleRate: e.target.value }))}
          className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          aria-label="Presale Rate"
        />
      </div>

      {/* Hardcap Token */}
      <div className="mb-4">
        <label className="block text-[19px] mb-2">Hardcap Token</label>
        <input
          type="number"
          onChange={(e) => setPresaleDetails(prev => ({ ...prev, hardcapToken: e.target.value }))}
          className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          aria-label="Hardcap Token"
        />
      </div>

      {/* Softcap Token */}
      <div className="mb-8">
        <label className="block text-[19px] mb-2">Softcap Token</label>
        <input
          type="number"
          onChange={(e) => setPresaleDetails(prev => ({ ...prev, softcapToken: e.target.value }))}
          className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          aria-label="Softcap Token"
        />
      </div>

      {/* Whitelist Option */}
      <div className="mb-4">
        <label className="block text-[19px] mb-1">Whitelist</label>
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="whitelist"
              value={false}
              checked={!whiteList}
              onChange={() => handleWhitelist(false)}
              className="hidden peer"
              aria-label="Disable Whitelist"
            />
            <div className="w-4 h-4 border-2 border-white rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] flex items-center justify-center mr-2">
              <div className="w-1.5 h-1.5 rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5]"></div>
            </div>
            Disable
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="whitelist"
              value={true}
              checked={whiteList}
              onChange={() => handleWhitelist(true)}
              className="hidden peer"
              aria-label="Enable Whitelist"
            />
            <div className="w-4 h-4 border-2 border-white rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] flex items-center justify-center mr-2">
              <div className="w-1.5 h-1.5 rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5]"></div>
            </div>
            Enable
          </label>
        </div>
        <p className="text-xs">Toggle whitelist on/off anytime.</p>
      </div>

      {/* Minimum Buy and Maximum Buy */}
      <div className="flex flex-col xxs1:flex-row justify-between mb-4">
        <div className="xxs1:w-1/2 pr-2 mb-6">
          <label className="block text-[19px] mb-1">Minimum Buy</label>
          <input
            type="number"
            onChange={(e) => setPresaleDetails(prev => ({ ...prev, minimumBuy: e.target.value }))}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
            aria-label="Minimum Buy"
          />
        </div>
        <div className="xxs1:w-1/2 xxs1:pl-2 mb-6">
          <label className="block text-[19px] mb-1">Maximum Buy</label>
          <input
            type="number"
            onChange={(e) => setPresaleDetails(prev => ({ ...prev, maximumBuy: e.target.value }))}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
            aria-label="Maximum Buy"
          />
        </div>
      </div>

      {/* Start Time and End Time */}
      <div className="flex flex-col xxs1:flex-row justify-between mb-[50px] xxs1:mb-8">
        <div className="xxs1:w-1/2 pr-2 mb-6">
          <label className="block text-[19px] mb-1">Start Time</label>
          <input
            type="datetime-local"
            onChange={(e) => setPresaleDetails(prev => ({ ...prev, startTime: e.target.value }))}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
            aria-label="Start Time"
          />
        </div>
        <div className="xxs1:w-1/2 xxs1:pl-2 mb-6">
          <label className="block text-[19px] mb-1">End Time</label>
          <input
            type="datetime-local"
            onChange={(e) => setPresaleDetails(prev => ({ ...prev, endTime: e.target.value }))}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
            aria-label="End Time"
          />
        </div>
      </div>
      
    </div>
  );
};

export default LaunchpadInfoTab;
