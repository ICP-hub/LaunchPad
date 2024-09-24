import React from 'react';

const TokenInfoTab = () => {
  return (
    <div className=" text-gray-300 p-6 rounded-lg w-full max-w-full">
      {/* Token Address */}
      <div className="flex justify-between mb-4">
        <span>Address</span>
        <span className=" border-b-2 ml-2 text-right overflow-hidden text-ellipsis whitespace-nowrap">0xd8319162260Db2Fa5027AACFfBf52E319b1E7C0</span>
      </div>
      <p className="text-xs  mb-6">Do not send BNB to the token address</p>

      {/* Token Details */}
      <div className="border-t  pt-4">
        <div className="flex border-b-2 justify-between py-2">
          <span>Name</span>
          <span>Chambs</span>
        </div>
        <div className="flex border-b-2 justify-between py-2">
          <span>Symbol</span>
          <span>CHAMBS</span>
        </div>
        <div className="flex  border-b-2 justify-between py-2">
          <span>Decimals</span>
          <span>18</span>
        </div>
        <div className="flex border-b-2 justify-between py-2">
          <span className="text-gray-400">Total Supply</span>
          <span className="text-white">10,000,000</span>
        </div>
      </div>
    </div>
  );
};

export default TokenInfoTab;