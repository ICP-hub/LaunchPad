import React from 'react';

const AdditionalInfoTab = () => {
  return (
    <div className="bg-[#222222] p-3 xxs1:p-8  rounded-2xl h-[1400px] mb-24 xxs1:mb-0   xxs1:h-[1000px]">
        {/* Chain Text with Gray Background on mobile only*/}
        <div className="flex  xxs1:hidden mb-8 bg-[rgb(68,68,68)] pl-6 p-2 mt-[-15px] mx-[-12px] rounded-2xl">
            <span className="text-white text-[22px]">Chain</span>
          </div>
      <div className="flex flex-col xxs1:flex-row justify-between mb-4">
        <div className=" w-full xxs1:w-1/2 xxs1:pr-2 mb-6">
          <label className="block text-[19px]  mb-1">Logo URL</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className="w-full xxs1:w-1/2 xxs1:pl-2 mb-4">
          <label className="block text-[19px]  mb-1">Website</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
      </div>

      <div className="flex flex-col xxs1:flex-row  justify-between mb-4">
        <div className="w-full xxs1:w-1/2 xxs1:pr-2 mb-6">
          <label className="block text-[19px]  mb-1">Facebook</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className="w-full xxs1:w-1/2 xxs1:pl-2 mb-4">
          <label className="block text-[19px]  mb-1">Twitter</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
      </div>

      <div className="flex flex-col  xxs1:flex-row  justify-between mb-4">
        <div className="w-full xxs1:w-1/2 xxs1:pr-2 mb-4">
          <label className="block text-[19px]  mb-1">GitHub</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className=" w-full xxs1:w-1/2 xxs1:pl-2">
          <label className="block text-[19px]  mb-1">Telegram</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
      </div>

      <div className="flex flex-col xxs1:flex-row justify-between mb-4">
        <div className="w-full xxs1:w-1/2 xxs1:pr-2 mb-4">
          <label className="block text-[19px]  mb-1">Instagram</label>
          <input
            type="text"
            className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
          />
        </div>
        <div className="w-full xxs1:w-1/2 xxs1:pl-2">
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

      <div className="flex    justify-center items-center  ">
        <button className="border-1  hidden xxs1:block  bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] 
          text-black  relative w-[120px] xxs1:w-[250px] md:w-[360px] h-[25px] lg:h-[35px]
             text-[15px] md:text-[18px] font-[600] rounded-2xl">
          APPROVE SPENDING TOKEN
        </button>
        
      </div>
    </div>
  );
};

export default AdditionalInfoTab;
