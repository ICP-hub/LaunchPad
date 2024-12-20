import React, { useEffect, useState } from 'react';
import { convertTimestampToIST } from '../../../utils/convertTimestampToIST';
import CopyToClipboard from '../../../common/CopyToClipboard';
import PoolDetailsSkeleton from '../../../common/SkeletonUI/PoolDetailsSkeleton';

const AffiliateProgram = ({ poolData, presaleData }) => {
  const [saleTime, setSaleTime] = useState({ start_time: "N/A", end_time: "N/A" });
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (presaleData?.start_time_utc) {
      const startTime = convertTimestampToIST(presaleData.start_time_utc);
      setSaleTime(prev => ({ ...prev, start_time: startTime }));
    }
    if (presaleData?.end_time_utc) {
      const endTime = convertTimestampToIST(presaleData.end_time_utc);
      setSaleTime(prev => ({ ...prev, end_time: endTime }));
    }
    setIsLoading(false)
  }, [presaleData]);


  return (
    <div className="bg-[#FFFFFF1A] sm:bg-transparent text-gray-300 p-2 xxs1:p-6 rounded-lg w-full max-w-full">

      {!isLoading ?
        <>
          {/* Pool Address */}
          <div className="flex justify-between gap-1 mb-6">
            <span>Address</span>
            <span className="border-b-2 overflow-hidden text-right"> <CopyToClipboard address={poolData?.canister_id} /> </span>
          </div>

          {/* Pool Information */}
          <div className="border-t pt-4 space-y-2">

            {/* Tokens for Presale */}
            <div className="flex justify-between text-[14px] xxs1:text-[17px] border-b py-2">
              <span>Total Supply</span>
              <span>{`${poolData?.total_supply || 'N/A'} ${poolData?.token_symbol || ''}`}</span>
            </div>

            {/* Fairlaunch  Tokens */}
            <div className="flex justify-between text-[14px] xxs1:text-[17px] border-b py-2">
              {/* <span>Initial Market Cap</span> */}
              <span>Fairlaunch Tokens</span>
              <span>{`${Number(presaleData?.tokens_for_fairlaunch) || 0} ${poolData?.token_symbol}  `}</span>
            </div>

            {/* SoftCap */}
            <div className="flex justify-between text-[14px] xxs1:text-[17px] border-b py-2">
              <span>SoftCap</span>
              <span> {`${Number(presaleData?.softcap)} ICP`} </span>
            </div>

            {/* hardcap */}
            <div className="flex justify-between text-[14px] xxs1:text-[17px] border-b py-2">
              <span>Hardcap</span>
              <span> {`${Number(presaleData?.hardcap)} ICP`} </span>
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
              <span> {` ${presaleData?.liquidity_percentage}% `} </span>
            </div>

          </div>
        </>
        :
        <PoolDetailsSkeleton/>
      }
    </div>
  );
};

export default AffiliateProgram;