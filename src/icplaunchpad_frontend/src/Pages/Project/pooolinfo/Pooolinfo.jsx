import React from 'react'

const AffiliateProgram = () => {
  return (
    <div className=" bg-[#FFFFFF1A]  sm:bg-transparent text-gray-300 p-6 rounded-lg w-full max-w-full">
      {/* Pool Address */}
      <div className="flex justify-between gap-1 mb-4">
        <span>Address</span>
        <span className="border-b-2  overflow-hidden text-right">0x55112e6092B12b2bA177A3C9f334C5a5cE84B5c2F</span>
      </div>

      {/* Pool Information */}
      <div className="border-t  pt-4">
        {/* Tokens for Presale */}
        <div className="flex justify-between border-b py-2">
          <span>Tokens For Presale</span>
          <span className="text-white">3,000,000 CHAMBS</span>
        </div>

        {/* Initial Market Cap */}
        <div className="flex  border-b justify-between py-2">
          <span>Initial Market Cap</span>
          <span className="text-white">1,453,500 CHAMBS</span>
        </div>

        {/* SoftCap */}
        <div className="flex  border-b justify-between py-2">
          <span>SoftCap</span>
          <span className="text-white">1 BNB</span>
        </div>

        {/* Start Time */}
        <div className="flex border-b justify-between py-2">
          <span>Start Time</span>
          <span className="text-white">2024.06.11 09:00 (UTC)</span>
        </div>

        {/* End Time */}
        <div className="flex border-b justify-between py-2">
          <span>End Time</span>
          <span className="text-white">2024.06.13 23:59 (UTC)</span>
        </div>

          <div className="flex  border-b justify-between py-2">
          <span>Listing On</span>
          <span className="text-white underline">Pancakeswap</span>
        </div>

        <div className="flex  border-b justify-between py-2">
          <span>Liquidity Percent</span>
          <span className="text-white">51%</span>
        </div>

        <div className="flex  border-b justify-between py-2">
          <span>Liquidity Lockup Time</span>
          <span className="text-white">500 days after pool ends</span>
        </div>
        
      </div>
    </div>
  )
}

export default AffiliateProgram