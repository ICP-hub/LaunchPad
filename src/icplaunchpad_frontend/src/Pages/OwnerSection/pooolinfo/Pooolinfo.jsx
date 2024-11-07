import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { convertTimestampToIST } from '../../../utils/convertTimestampToIST';
import { useAuth } from '../../../StateManagement/useContext/useAuth';
import { Principal } from '@dfinity/principal';

const PoolInfoTab = ({ presaleData, poolData }) => {
  const { actor } = useAuth();
  const [presale, setPresale] = useState(presaleData || null); // Set presaleData initially if available
  const [saleTime, setSaleTime] = useState({ start_time: "N/A", end_time: "N/A" });

  useEffect(() => {
    async function fetchPresale() {
      try {
        if (!presaleData && poolData?.canister_id) { // Fetch only if presaleData is missing
          const ledgerId = Principal.fromText(poolData.canister_id);
          const presaleResponse = await actor.get_sale_params(ledgerId);
          if (presaleResponse && presaleResponse.Ok) {
            setPresale(presaleResponse.Ok);
          } else {
            console.error("Failed to fetch presale data:", presaleResponse);
          }
        }
      } catch (error) {
        console.error("Error fetching presale data:", error);
      }
    }
    fetchPresale();
  }, [presaleData, poolData, actor]);

  useEffect(() => {
    if (presale) {
      const startTime = presale.start_time_utc ? convertTimestampToIST(presale.start_time_utc) : "N/A";
      const endTime = presale.end_time_utc ? convertTimestampToIST(presale.end_time_utc) : "N/A";
      setSaleTime({ start_time: startTime, end_time: endTime });
    }
  }, [presale]);

  return (
    <div className="text-gray-300 p-6 rounded-lg w-full max-w-full">
      <div className="flex justify-between gap-1 mb-4">
        <span>Address</span>
        <span className="border-b-2 overflow-hidden text-right">{poolData?.canister_id || "N/A"}</span>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between border-b py-2">
          <span className="text-gray-400">Tokens For Presale</span>
          <span className="text-white">{`${poolData?.total_supply || "N/A"} ${poolData?.token_symbol || ""}`}</span>
        </div>
        <div className="flex border-b justify-between py-2">
          <span className="text-gray-400">Initial Market Cap</span>
          {console.log('poolData',poolData)}
          <span className="text-white">{`1,453,500 ${poolData?.token_symbol || ""}`}</span>
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
