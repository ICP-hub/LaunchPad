import React from 'react'

const Activities= () => {
  return (
    <div className='  flex flex-col items-center justify-center  gap-8'>
       {/* Investment Summary */}
       <div className='flex md:flex-row flex-col '>
                <div className="flex  md:flex-col gap-4 md:gap-6 lg:gap-2 pt-14 text-[10px] sm5:text-[14px] dlg:text-[18px]    ">
                    <div >
                    <p class="whitespace-nowrap">Total Pool Invested</p>
                        <h2 className="text-2xl mt-2">0</h2>
                    </div>
                    <div className="text-start">
                        <p>Total ICP Invested</p>
                        <h2 className="text-2xl mt-2">0</h2>
                    </div>
                    <div className="text-start">
                        <p>Total Invested</p>
                        <h2 className="text-2xl mt-2">$0</h2>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-6 flex justify-center items-center ">
                   

                    {/* Transaction Table */}
                    <div className="bg-[#FFFFFF0A]  ml-8  w-[210px] xxs1:w-[300px]   sm5:w-[450px]  md1:w-[500px] lg:w-[570px] lgx:w-[750px] h-[275px]  mt-4 rounded-2xl text-center ">
                        <div className="grid grid-cols-5 bg-[#3f3d3d] m-0 py-4  rounded-t-2xl text-xs mb-4 ">
                            <span>Name</span>
                            <span >Date</span>
                            <span className='md:block hidden'>Amount</span>
                            <span className='md:block hidden'>Type</span>
                            <span className='md:block hidden'>Transaction</span>
                        </div>
                        
                        <p className='mt-24'>No Data</p>
                        
                    </div>
                </div>
            </div>
    </div>
  )
}

export default Activities;