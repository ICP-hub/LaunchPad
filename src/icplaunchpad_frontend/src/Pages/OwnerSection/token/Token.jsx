import React, { useEffect, useState } from 'react';
import { PiCopyDuotone } from 'react-icons/pi';
import CopyToClipboard from '../../../common/CopyToClipboard';
import TokenDetailsSkeleton from '../../../common/SkeletonUI/TokenDetailsSkeleton';
import { fetchWithRetry } from '../../../utils/fetchWithRetry';

const TokenInfoTab = ({ ledger_canister_id, actor }) => {
  const [tokenData, setTokenData] = useState(null);
  console.log(ledger_canister_id)
  const fetchTokenData = async () => {
    try {
      if (actor) {
        
        // Fetch Token Details with retry logic
        const tokenDataResults = await Promise.allSettled([
          fetchWithRetry(() => actor.icrc1_name(), 3, 1000),
          fetchWithRetry(() => actor.icrc1_symbol(), 3, 1000),
          fetchWithRetry(() => actor.icrc1_decimals(), 3, 1000),
          fetchWithRetry(() => actor.icrc1_total_supply(), 3, 1000),
        ]);

        console.log("Token Data Results:", tokenDataResults);

        const tokenName = tokenDataResults[0].status === "fulfilled" ? tokenDataResults[0].value : null;
        const tokenSymbol = tokenDataResults[1].status === "fulfilled" ? tokenDataResults[1].value : null;
        const tokenDecimals = tokenDataResults[2].status === "fulfilled" ? tokenDataResults[2].value : null;
        const tokenSupply = tokenDataResults[3].status === "fulfilled" ? tokenDataResults[3].value : null;

        setTokenData({
          tokenName,
          tokenSymbol,
          tokenDecimals,
          tokenSupply,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTokenData();
  }, [actor]);

  return (
    <div className="text-gray-300 p-6 rounded-lg w-full max-w-full">
    
    {tokenData ? (
          <>
      <div className="flex justify-between mb-4">
        <span>Address</span>
        <span className="border-b-2  ml-2 text-right overflow-hidden text-ellipsis whitespace-nowrap">
          <CopyToClipboard address={ledger_canister_id} />

        </span>
      </div>
      <p className="text-xs mb-6">Do not send ICP to the token address</p>

      {/* Token Details */}
      <div className="border-t pt-4">
      
            <div className="flex border-b-2 justify-between py-2">
              <span>Name</span>
              <span>{tokenData.tokenName || 'N/A'}</span>
            </div>
            <div className="flex border-b-2 justify-between py-2">
              <span>Symbol</span>
              <span>{tokenData.tokenSymbol || 'N/A'}</span>
            </div>
            <div className="flex border-b-2 justify-between py-2">
              <span>Decimals</span>
              <span>{tokenData.tokenDecimals || 'N/A'}</span>
            </div>
            <div className="flex border-b-2 justify-between py-2">
              <span className="text-gray-400">Total Supply</span>
              <span className="text-white">
                {tokenData.tokenSupply ? tokenData.tokenSupply.toString() : 'N/A'}
              </span>
            </div>    
      </div>
      </>
        ) : (
          <TokenDetailsSkeleton/>
        )}
    </div>
  );
};

export default TokenInfoTab;
