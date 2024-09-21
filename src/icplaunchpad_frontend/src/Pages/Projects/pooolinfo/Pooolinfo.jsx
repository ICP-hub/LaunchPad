import React from 'react'

const Pooolinfo = () => {
  return (
    <div className='min-h-[228px] mt-[40px] flex flex-col gap-5'>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
          <div>Address</div>
        <div className='border-b-2 border-[#FFFFFF80] mb-2'>
        0x55112e6092B1b2bA177A3C9f334C5a5cE84B5c2F
        </div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Tokens For Presale</div>
        <div>3,000,000 CHAMBS</div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Tokens For Liquidity</div>
        <div>1,453,500 CHAMBS</div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Initial Market Cap</div>
        <div>$3,605.3631</div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>SoftCap</div>
        <div>1 BNB</div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Start Time</div>
        <div>2024.06.11 09:00 (UTC)</div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>End Time</div>
        <div>2024.06.13 23:59 (UTC)</div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Listing On</div>
        <div className='border-b-2 border-[#FFFFFF80] mb-2'>Pancakeswap</div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Liquidity Percent</div>
        <div>51%</div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Liquidity Lockup Time</div>
        <div>500 days after pool ends</div>
      </div>
    </div>
  )
}

export default Pooolinfo