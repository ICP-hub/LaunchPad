import React from "react";

const Tokenomic = () => {
  return (
    <div className="mt-[20px] flex flex-col gap-8 text-gray-300  rounded-lg w-full max-w-full">
      <div className="flex w-full">
        <div className="bg-[#F3B3A7] w-full h-[58px]"></div>
        <div className="bg-[#CACCF5] w-full h-[58px]"></div>
        <div className="bg-[#3E3E3E] w-full h-[58px]"></div>
        <div className="bg-[#FFFFFF] w-full h-[58px]"></div>
      </div>
      <div className="flex justify-between  text-[10px] xxs1:text-[15px] sm:text-[17px]">
        <div className="w-[114px] h-[24px]  flex">
          <div className="bg-[#F3B3A7] w-[50%]"></div>
          <div className="w-[50%] flex justify-end"> Presale </div>
        </div>
        <div className="w-[114px] h-[24px] flex">
          <div className="bg-[#CACCF5] w-[40%]"></div>
          <div className="w-[60%] flex justify-end"> Liquidity </div>
        </div>
        <div className="w-[114px] h-[24px] flex">
          <div className="bg-[#3E3E3E] w-[50%]"></div>
          <div className="w-[50%] flex justify-end"> Locked </div>
        </div>
        <div className="w-[114px] h-[24px] flex">
          <div className="bg-[#FFFFFF] w-[40%]"></div>
          <div className="w-[60%] flex justify-end ml-1"> Unlocked </div>
        </div>
      </div>
    </div>
  );
};

export default Tokenomic;