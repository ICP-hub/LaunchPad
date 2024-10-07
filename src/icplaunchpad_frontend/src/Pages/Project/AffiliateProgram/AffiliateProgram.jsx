import React from 'react'

const AffiliateProgram = () => {
  return (
    <div className='min-h-[228px] mt-[40px] flex flex-col gap-4'>
       <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Pool Referrer Count</div>
        <div>3</div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Realtime Reward Percentage</div>
        <div>6%</div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Current Rewards</div>
        <div>0.196932 BNB</div>
      </div>
      <div className="flex justify-between border-b-2 border-[#FFFFFF80]">
        <div>Total Ref Amount</div>
        <div>3.250091 BNB</div>
      </div>
      <div className="min-h-[102px] bg-[#FFFFFF1A] rounded-3xl gap-4 text-[10px] xxs1:text-[17px] xxs1:gap-8 flex flex-col p-3">
        <div>Top rewards</div>
        <div className='flex gap-2 flex-col'>
          <div className='flex justify-between '>
            <div>0x6ECe...d4d0</div>
            <div>1.714 (52.76%)</div>
            <div>0.1039</div>
          </div>
          <div className='flex justify-between'>
            <div>0x8913...8445</div>
            <div>1.4533 (44.72%)</div>
            <div>0.0881</div>
          </div>
          <div className='flex justify-between '>
            <div>0x722f...0257</div>
            <div>0.082 (2.52%)</div>
            <div>0.005</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AffiliateProgram