import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { convertTimestampToIST } from '../../../utils/convertTimestampToIST';
import { Principal } from '@dfinity/principal';
import CopyToClipboard from '../../../common/CopyToClipboard';

const PoolInfoTab = ({ presaleData, poolData }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const principal = useSelector((currState) => currState.internet.principal);
  const [presale, setPresale] = useState(presaleData || null); // Set presaleData initially if available
  const [saleTime, setSaleTime] = useState({ start_time: "N/A", end_time: "N/A" });

  useEffect(() => {
    async function fetchPresale() {
      try {
        if (!presaleData && poolData?.canister_id) { // Fetch only if presaleData is missing
          const ledgerId = typeof poolData?.canister_id === 'string'
            ? Principal.fromText(poolData?.canister_id)
            : Principal.fromUint8Array(poolData?.canister_id);

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
      <div className="flex justify-between gap-1 mb-6">
        <span>Address</span>
        <span className="border-b-2 overflow-hidden text-right">
          <CopyToClipboard address={poolData?.canister_id} />
        </span>
      </div>
      {/* Total Supply  */}
      <div className="border-t pt-4">
        <div className="flex justify-between border-b py-2">
          <span className="text-gray-400">Total Supply</span>
          <span className="text-white">{`${poolData?.total_supply || "N/A"} ${poolData?.token_symbol || ""}`}</span>
        </div>
        {/* Fairlaunch  Tokens*/}
        <div className="flex border-b justify-between py-2">
          <span className="text-gray-400">  Fairlaunch Tokens</span>
          {console.log('poolData', poolData)}
          <span className="text-white">{`${Number(presale?.tokens_for_fairlaunch) || 0} ${poolData?.token_symbol} `}</span>
        </div>
        {/* SoftCap */}
        <div className="flex border-b justify-between py-2">
          <span className="text-gray-400">SoftCap</span>
          <span className="text-white"> {`${Number(presale?.softcap) || 0} ICP`}</span>
        </div>
        {/* hardcap */}
        <div className="flex border-b justify-between py-2">
          <span className="text-gray-400">Hardcap</span>
          <span className="text-white"> {`${Number(presale?.hardcap) || 0} ICP`}</span>
        </div>
        {/* Start Time */}
        <div className="flex border-b justify-between py-2">
          <span className="text-gray-400">Start Time</span>
          <span className="text-white">{saleTime.start_time}</span>
        </div>
        {/* End Time */}
        <div className="flex border-b justify-between py-2">
          <span className="text-gray-400">End Time</span>
          <span className="text-white">{saleTime.end_time}</span>
        </div>
        {/* Listing Platform */}
        <div className="flex justify-between text-[14px] xxs1:text-[17px] border-b py-2">
          <span>Listing On</span>
          <span className="underline">Pancakeswap</span>
        </div>

        {/* Liquidity Percent */}
        <div className="flex justify-between text-[14px] xxs1:text-[17px] border-b py-2">
          <span>Liquidity Percent</span>
          <span> {` ${presale?.liquidity_percentage}% `} </span>
        </div>
      </div>
    </div>
  );
};

export default PoolInfoTab;




