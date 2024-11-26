import React, { useEffect, useState } from 'react';
import { convertTimestampToIST } from '../../../utils/convertTimestampToIST';

const AffiliateProgram = ({ poolData, presaleData }) => {
  const [saleTime, setSaleTime] = useState({ start_time: "N/A", end_time: "N/A" });

  useEffect(() => {
    if (presaleData?.start_time_utc) {
      const startTime = convertTimestampToIST(presaleData.start_time_utc);
      setSaleTime(prev => ({ ...prev, start_time: startTime }));
    }
    if (presaleData?.end_time_utc) {
      const endTime = convertTimestampToIST(presaleData.end_time_utc);
      setSaleTime(prev => ({ ...prev, end_time: endTime }));
    }
  }, [presaleData]);


  return (
    <div className="bg-[#FFFFFF1A] sm:bg-transparent text-gray-300 p-2 xxs1:p-6 rounded-lg w-full max-w-full">
      {/* Pool Address */}
      <div className="flex justify-between gap-1 mb-4">
        <span>Address</span>
        <span className="border-b-2 overflow-hidden text-right">{poolData?.canister_id || 'N/A'}</span>
      </div>

      {/* Pool Information */}
      <div className="border-t pt-4 space-y-2">
        {/* Tokens for Presale */}
        <div className="flex justify-between text-[14px] xxs1:text-[17px] border-b py-2">
          <span>Tokens For Presale</span>
          <span>{`${poolData?.total_supply || 'N/A'} ${poolData?.token_symbol || ''}`}</span>
        </div>

        {/* Initial Market Cap */}
        <div className="flex justify-between text-[14px] xxs1:text-[17px] border-b py-2">
          {/* <span>Initial Market Cap</span> */}
          <span>Fairlaunch Tokens</span>
          <span>{`${Number(presaleData?.tokens_for_fairlaunch) || 0 } ${poolData?.token_symbol}  `}</span>
        </div>

        {/* SoftCap */}
        <div className="flex justify-between text-[14px] xxs1:text-[17px] border-b py-2">
          <span>SoftCap</span>
          <span> {`${Number(presaleData?.softcap)} ICP`} </span>
        </div>

        {/* Start Time */}
        <div className="flex justify-between text-[14px] xxs1:text-[17px] border-b py-2">
          <span>Start Time</span>
          <span>{saleTime.start_time}</span>
        </div>

        {/* End Time */}
        <div className="flex justify-between text-[14px] xxs1:text-[17px] border-b py-2">
          <span>End Time</span>
          <span>{saleTime.end_time}</span>
        </div>

        {/* Listing Platform */}
        <div className="flex justify-between text-[14px] xxs1:text-[17px] border-b py-2">
          <span>Listing On</span>
          <span className="underline">Pancakeswap</span>
        </div>

        {/* Liquidity Percent */}
        <div className="flex justify-between text-[14px] xxs1:text-[17px] border-b py-2">
          <span>Liquidity Percent</span>
          <span>51%</span>
        </div>

        {/* Liquidity Lockup Time */}
        <div className="flex justify-between text-[14px] xxs1:text-[17px] border-b py-2">
          <span>Liquidity Lockup Time</span>
          <span>500 days after pool ends</span>
        </div>
      </div>
    </div>
  );
};

export default AffiliateProgram;
