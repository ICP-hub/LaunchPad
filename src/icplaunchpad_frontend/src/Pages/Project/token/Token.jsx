import React, { useEffect, useState } from 'react';
import { useAuths } from '../../../StateManagement/useContext/useClient';
import CopyToClipboard from '../../../common/CopyToClipboard';
import { fetchWithRetry } from '../../../utils/fetchWithRetry';


const TokenTab = ({ ledgerId }) => {
  const {createCustomActor}=useAuths();
  const [tokenData, setTokenData] = useState(null);
   console.log('ledgerId->', ledgerId)
   const fetchTokenData = async () => {
    try {
      const actor = await fetchWithRetry(
        () => createCustomActor(ledgerId), // Retry creating the actor
        3,
        1000
      );
  
      if (actor) {
        // Fetch token data using Promise.allSettled with retry logic
        const tokenDataResults = await Promise.allSettled([
          fetchWithRetry(() => actor?.icrc1_name(), 3, 1000),
          fetchWithRetry(() => actor?.icrc1_symbol(), 3, 1000),
          fetchWithRetry(() => actor?.icrc1_decimals(), 3, 1000),
          fetchWithRetry(() => actor?.icrc1_total_supply(), 3, 1000),
        ]);
  
        const tokenName = tokenDataResults[0]?.status === "fulfilled" ? tokenDataResults[0]?.value : null;
        const tokenSymbol = tokenDataResults[1]?.status === "fulfilled" ? tokenDataResults[1]?.value : null;
        const tokenDecimals = tokenDataResults[2]?.status === "fulfilled" ? tokenDataResults[2]?.value : null;
        const tokenSupply = tokenDataResults[3]?.status === "fulfilled" ? tokenDataResults[3]?.value : null;
  
        if (tokenName && tokenSymbol && tokenDecimals && tokenSupply) {
          setTokenData({
            tokenName,
            tokenSymbol,
            tokenDecimals,
            tokenSupply,
          });
        } else {
          console.error("Some token data could not be fetched.");
        }
      }
    } catch (err) {
      console.error("Error fetching token data:", err);
    }
  };

  useEffect(() => {
    if (ledgerId) {
      fetchTokenData();
    }
  }, [ledgerId]); // Trigger fetch when ledgerId changes

  return (
    <div className="bg-[#FFFFFF1A] sm:bg-transparent text-gray-300 p-3 xxs1:p-6 rounded-lg w-full max-w-full">
      {/* Token Address */}
      <div className="flex justify-between mb-4">
        <span>Address</span>
        <span className="border-b-2 ml-2 text-right overflow-hidden text-ellipsis whitespace-nowrap">
          <CopyToClipboard address={ledgerId}/>
        </span>
      </div>
      <p className="text-xs mb-6">Do not send ICP to the token address</p>

      {/* Token Details */}
      <div className="border-t pt-4">
        {tokenData ? (
          <>
            <div className="flex border-b-2 justify-between py-2">
              <span>Name</span>
              <span>{tokenData.tokenName}</span>
            </div>
            <div className="flex border-b-2 justify-between py-2">
              <span>Symbol</span>
              <span>{tokenData.tokenSymbol}</span>
            </div>
            <div className="flex border-b-2 justify-between py-2">
              <span>Decimals</span>
              <span>{tokenData.tokenDecimals}</span>
            </div>
            <div className="flex border-b-2 justify-between py-2">
              <span className="text-gray-400">Total Supply</span>
              <span className="text-white">
                {tokenData.tokenSupply ? tokenData.tokenSupply.toString() : 'N/A'}
              </span>
            </div>
          </>
        ) : (
          <div className="text-center py-4">Loading token data...</div>
        )}
      </div>
    </div>
  );
};

export default TokenTab;
