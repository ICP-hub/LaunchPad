import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const AffiliateProgram = ({poolData, presaleData}) => {

  const [saleTime, setSaleTime] = useState({ start_time: "N/A", end_time: "N/A" });
  console.log('poolData--', poolData);
  useEffect(() => {
    console.log('poolData--', poolData);
    console.log('presale--', presaleData);

    if (presaleData?.start_time_utc) {
      const startTime = convertTimestampToUTC(presaleData?.start_time_utc);
      setSaleTime((prev) => ({ ...prev, start_time: startTime }));
    }
    if (presaleData?.end_time_utc) {
      const endTime = convertTimestampToUTC(presaleData?.end_time_utc);
      setSaleTime((prev) => ({ ...prev, end_time: endTime }));
    }
  }, [presaleData]);

  function convertTimestampToUTC(timestamp) {
    if (!timestamp) return;

    // Parse the timestamp as a BigInt
    const timestampBigInt = BigInt(timestamp);

    // Determine if timestamp is in seconds or nanoseconds
    const secondsTimestamp = timestampBigInt > 1_000_000_000_000n 
        ? timestampBigInt / 1_000_000_000n  // Nanoseconds to seconds
        : timestampBigInt;                  // Already in seconds

    const date = new Date(Number(secondsTimestamp) * 1000); // Convert to milliseconds

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes} (UTC)`;
}


  return (
    <div className=" bg-[#FFFFFF1A]  sm:bg-transparent text-gray-300 p-2 xxs1:p-6 rounded-lg w-full max-w-full">
      {/* Pool Address */}
      <div className="flex justify-between gap-1 mb-4">
        <span>Address</span>
        <span className="border-b-2  overflow-hidden text-right">0x55112e6092B12b2bA177A3C9f334C5a5cE84B5c2F</span>
      </div>

      {/* Pool Information */}
      <div className="border-t  pt-4">
        {/* Tokens for Presale */}
        <div className="flex justify-between gap-12 text-[14px] xxs1:text-[17px] border-b py-2">
          <span>Tokens For Presale</span>
          <span> {`${poolData?.total_supply} ${poolData?.token_name}`}</span>
        </div>

        {/* Initial Market Cap */}
        <div className="flex  border-b gap-9 justify-between text-[14px] xxs1:text-[17px] py-2">
          <span>Initial Market Cap</span>
          <span> {`1,453,500 ${poolData?.token_name}`} </span>
        </div>

        {/* SoftCap */}
        <div className="flex  border-b justify-between text-[14px] xxs1:text-[17px] py-2">
          <span>SoftCap</span>
          <span>1 BNB</span>
        </div>

        {/* Start Time */}
        <div className="flex border-b gap-9 text-[14px] xxs1:text-[17px] justify-between py-2">
          <span>Start Time</span>
          <span> {saleTime.start_time} </span>
        </div>

        {/* End Time */}
        <div className="flex border-b gap-9 justify-between text-[14px] xxs1:text-[17px] py-2">
          <span>End Time</span>
          <span>{saleTime.end_time}</span>
        </div>

          <div className="flex  gap-9 border-b text-[14px] xxs1:text-[17px] justify-between py-2">
          <span>Listing On</span>
          <span className="underline">Pancakeswap</span>
        </div>

        <div className="flex gap-9 text-[14px] xxs1:text-[17px] border-b justify-between py-2">
          <span>Liquidity Percent</span>
          <span>51%</span>
        </div>

        <div className="flex gap-4 text-[14px] xxs1:text-[17px] border-b justify-between py-2">
          <span>Liquidity Lockup Time</span>
          <span>500 days after pool ends</span>
        </div>
        
      </div>
    </div>
  )
}

export default AffiliateProgram