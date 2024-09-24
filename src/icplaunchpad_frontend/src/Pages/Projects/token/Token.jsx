import React from 'react'

const Token = () => {
  return (
    <div className='min-h-[228px] mt-[40px] flex flex-col gap-5'>
      <div className="flex justify-between">
        <div>
          <div>Address</div>
          <div className='text-xs'>Do not send BNB to the token address</div>
        </div>
        <div className='border-b-2 border-[#FFFFFF80] flex items-center'>
          0xd831916226D0b2Fa5027A4ACFFbF52E319b1E7C0
        </div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Name</div>
        <div>Chambs</div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Symbol</div>
        <div>CHAMBS</div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Decimals</div>
        <div>18</div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Total Supply</div>
        <div>10,000,000</div>
      </div>
    </div>
  )
}

export default Token