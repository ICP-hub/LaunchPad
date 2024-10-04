import React from 'react';

const AdditionalInfoTab = ({ setPresaleDetails }) => {
  return (
    <div className="bg-[#222222] p-3 xxs1:p-8 rounded-2xl lg:h-[1050px] mx-8 mb-[120px] xxs1:mb-11 sm5:mb-6 md:mb-4 lg:mb-0 h-[1350px] xxs1:h-[1000px]">
      
      {/* Chain Text with Gray Background on mobile only */}
      <div className="flex xxs1:hidden mb-8 bg-[#444444] pl-6 p-2 mt-[-15px] mx-[-12px] rounded-2xl">
        <span className="text-white text-[22px]">Chain</span>
      </div>

      {/* Logo URL and Website */}
      <div className="flex flex-col xxs1:flex-row justify-between mb-4">
        <div className="w-full xxs1:w-1/2 xxs1:pr-2 mb-6">
          <label className="block text-[19px] mb-1">Logo URL</label>
          <input
             type="file"
            onChange={(e) =>setPresaleDetails((prevDetails) => ({...prevDetails,logoURL: e.target.files[0]}))}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className="w-full xxs1:w-1/2 xxs1:pl-2 mb-4">
          <label className="block text-[19px] mb-1">Website</label>
          <input
            type="text"
            onChange={(e) => setPresaleDetails(prev => ({ ...prev, website: e.target.value }))}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
      </div>

      {/* Social Media Links (Facebook, Twitter) */}
      <div className="flex flex-col xxs1:flex-row justify-between mb-4">
        <div className="w-full xxs1:w-1/2 xxs1:pr-2 mb-6">
          <label className="block text-[19px] mb-1">Facebook</label>
          <input
            type="text"
            onChange={(e) => setPresaleDetails(prev => ({ ...prev, facebook: e.target.value }))}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className="w-full xxs1:w-1/2 xxs1:pl-2 mb-4">
          <label className="block text-[19px] mb-1">Twitter</label>
          <input
            type="text"
            onChange={(e) => setPresaleDetails(prev => ({ ...prev, twitter: e.target.value }))}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
      </div>

      {/* Social Media Links (GitHub, Telegram) */}
      <div className="flex flex-col xxs1:flex-row justify-between mb-4">
        <div className="w-full xxs1:w-1/2 xxs1:pr-2 mb-4">
          <label className="block text-[19px] mb-1">GitHub</label>
          <input
            type="text"
            onChange={(e) => setPresaleDetails(prev => ({ ...prev, github: e.target.value }))}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className="w-full xxs1:w-1/2 xxs1:pl-2">
          <label className="block text-[19px] mb-1">Telegram</label>
          <input
            type="text"
            onChange={(e) => setPresaleDetails(prev => ({ ...prev, telegram: e.target.value }))}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
      </div>

      {/* Social Media Links (Instagram, Discord) */}
      <div className="flex flex-col xxs1:flex-row justify-between mb-4">
        <div className="w-full xxs1:w-1/2 xxs1:pr-2 mb-4">
          <label className="block text-[19px] mb-1">Instagram</label>
          <input
            type="text"
            onChange={(e) => setPresaleDetails(prev => ({ ...prev, instagram: e.target.value }))}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className="w-full xxs1:w-1/2 xxs1:pl-2">
          <label className="block text-[19px] mb-1">Discord</label>
          <input
            type="text"
            onChange={(e) => setPresaleDetails(prev => ({ ...prev, discord: e.target.value }))}
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
      </div>

      {/* Reddit Link */}
      <div className="mb-4">
        <label className="block text-[19px] mb-1">Reddit</label>
        <input
          type="text"
          onChange={(e) => setPresaleDetails(prev => ({ ...prev, reddit: e.target.value }))}
          className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
        />
      </div>

      {/* YouTube Video Link */}
      <div className="mb-4">
        <label className="block text-[19px] mb-1">YouTube Video</label>
        <input
          type="text"
          onChange={(e) => setPresaleDetails(prev => ({ ...prev, youtubeVideo: e.target.value }))}
          className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-[19px] mb-1">Description</label>
        <textarea
          onChange={(e) => setPresaleDetails(prev => ({ ...prev, description: e.target.value }))}
          className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2 h-32"
        ></textarea>
      </div>

      {/* Approve Spending Token Button */}
      <div className="flex justify-center items-center">
        <button className="hidden xxs1:block bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-black w-[120px] xxs1:w-[250px] md:w-[360px] h-[35px] text-[15px] md:text-[18px] font-[600] rounded-2xl">
          APPROVE SPENDING TOKEN
        </button>
      </div>
      
    </div>
  );
};

export default AdditionalInfoTab;
