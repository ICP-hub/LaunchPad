import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { convertTimestampToIST } from '../../../utils/convertTimestampToIST';

const PoolInfoTab = ({ poolData }) => {
  const presaleData = useSelector((state) => state.SaleParams.data);
  const [saleTime, setSaleTime] = useState({ start_time: "N/A", end_time: "N/A" });
  console.log('poolData--', poolData);
  
  useEffect(() => {
    console.log('poolData--', poolData);
    console.log('presale--', presaleData);

    if (presaleData?.Ok?.start_time_utc) {
      const startTime = convertTimestampToIST(presaleData.Ok.start_time_utc);
      setSaleTime((prev) => ({ ...prev, start_time: startTime }));
    }
    if (presaleData?.Ok?.end_time_utc) {
      const endTime = convertTimestampToIST(presaleData.Ok.end_time_utc);
      setSaleTime((prev) => ({ ...prev, end_time: endTime }));
    }
  }, [presaleData]);
  


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
