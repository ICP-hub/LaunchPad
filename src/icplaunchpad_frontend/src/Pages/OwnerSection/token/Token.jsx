import React, { useEffect, useState } from 'react';
import { PiCopyDuotone } from 'react-icons/pi';
import CopyToClipboard from '../../../common/CopyToClipboard';

const TokenInfoTab = ({ ledger_canister_id,actor }) => {
  const [tokenData, setTokenData] = useState(null);

  const fetchTokenData = async () => {
    try {
      if (actor) {
      
        const tokenName = await actor.icrc1_name();
        const tokenSymbol = await actor.icrc1_symbol();
        const tokenDecimals = await actor.icrc1_decimals();
        const tokenSupply = await actor.icrc1_total_supply();

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
      {/* Token Address */}
      <div className="flex justify-between mb-4">
        <span>Address</span>
        <span className="border-b-2  ml-2 text-right overflow-hidden text-ellipsis whitespace-nowrap">
         <CopyToClipboard address={ledger_canister_id}/>

        </span>
      </div>
      <p className="text-xs mb-6">Do not send ICP to the token address</p>

      {/* Token Details */}
      <div className="border-t pt-4">
        {tokenData ? (
          <>
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
          </>
        ) : (
          <div className="text-center py-4">Loading token data...</div>
        )}
      </div>
    </div>
  );
};

export default TokenInfoTab;
