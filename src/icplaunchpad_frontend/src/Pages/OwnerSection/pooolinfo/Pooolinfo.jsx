import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PoolInfoTab = ({ poolData }) => {
  const presaleData = useSelector((state) => state.SaleParams.data);
  const [saleTime, setSaleTime] = useState({ start_time: "N/A", end_time: "N/A" });
  console.log('poolData--', poolData);
  
  useEffect(() => {
    console.log('poolData--', poolData);
    console.log('presale--', presaleData);

    if (presaleData?.Ok?.start_time_utc) {
      const startTime = convertTimestampToUTC(presaleData.Ok.start_time_utc);
      setSaleTime((prev) => ({ ...prev, start_time: startTime }));
    }
    if (presaleData?.Ok?.end_time_utc) {
      const endTime = convertTimestampToUTC(presaleData.Ok.end_time_utc);
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
    <div className="text-gray-300 p-6 rounded-lg w-full max-w-full">
      <div className="flex justify-between gap-1 mb-4">
        <span>Address</span>
        <span className="border-b-2 overflow-hidden text-right">{poolData?.canister_id}</span>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between border-b py-2">
          <span className="text-gray-400">Tokens For Presale</span>
          <span className="text-white">{`${poolData?.total_supply} ${poolData?.token_name}`} </span>
        </div>
        <div className="flex border-b justify-between py-2">
          <span className="text-gray-400">Initial Market Cap</span>
          <span className="text-white">{`1,453,500 ${poolData?.token_name}`}</span>
        </div>
        <div className="flex border-b justify-between py-2">
          <span className="text-gray-400">SoftCap</span>
          <span className="text-white">1 BNB</span>
        </div>
        <div className="flex border-b justify-between py-2">
          <span className="text-gray-400">Start Time</span>
          <span className="text-white">{saleTime.start_time}</span>
        </div>
        <div className="flex border-b justify-between py-2">
          <span className="text-gray-400">End Time</span>
          <span className="text-white">{saleTime.end_time}</span>
        </div>
      </div>
    </div>
  );
};

export default PoolInfoTab;
