import React from 'react';

const AdditionalInfoTab = () => {
  return (
    <div className="bg-[#222222] p-8 rounded-md h-[900px]">
      <div className="flex justify-between mb-4">
        <div className="w-1/2 pr-2">
          <label className="block text-[19px]  mb-1">Logo URL</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-[19px]  mb-1">Website</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <div className="w-1/2 pr-2">
          <label className="block text-[19px]  mb-1">Facebook</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-[19px]  mb-1">Twitter</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <div className="w-1/2 pr-2">
          <label className="block text-[19px]  mb-1">GitHub</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-[19px]  mb-1">Telegram</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <div className="w-1/2 pr-2">
          <label className="block text-[19px]  mb-1">Instagram</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-[19px]  mb-1">Discord</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-[19px]  mb-1">Reddit</label>
        <input
          type="text"
          className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-[19px]  mb-1">Youtube Video</label>
        <input
          type="text"
          className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
        />
      </div>

      <div className="mb-6">
        <label className="block text-[19px]  mb-1">Description</label>
        <textarea
          className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2 h-32"
        ></textarea>
      </div>

      <div className="flex  justify-center items-center ">
        <button className="border-1   bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] 
          text-black  relative w-[120px] lg:w-[360px] h-[25px] lg:h-[35px]
             text-[10px] md:text-[18px] font-[600] rounded-2xl">
          APPROVE SPENDING TOKEN
        </button>
        
      </div>
    </div>
  );
};

export default AdditionalInfoTab;
