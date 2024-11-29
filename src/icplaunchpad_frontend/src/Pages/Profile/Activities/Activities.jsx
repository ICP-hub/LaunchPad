import React from 'react'
import NoDataFound from '../../../common/NoDataFound';

const Activities = () => {
    return (
        <div className='  flex flex-col items-center justify-center  gap-8'>
            {/* Investment Summary */}
            <div className='flex md:flex-row flex-col '>
                <div className="flex  md:flex-col font-posterama gap-3 ss2:gap-6 lg:gap-2 pt-14 text-[10px] sm5:text-[14px] dlg:text-[18px]    ">
                    <div >
                        <p className="whitespace-nowrap">Total Pool Invested</p>
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
                    <div className="bg-[#FFFFFF0A]  md:ml-8 w-full sm:w-[500px] lg:w-[570px] lgx:w-[750px] h-[275px] font-posterama  mt-4 rounded-2xl text-center ">
                        <div className="flex gap-11  bg-[#3f3d3d]  py-4  rounded-t-2xl text-[15px] mb-4 px-4">
                            <span>Name</span>
                            <span >Date</span>
                            <span className='md:block hidden'>Amount</span>
                            <span className='md:block hidden'>Type</span>
                            <span className='md:block hidden'>Transaction</span>
                        </div>

                        {/* <p className='mt-24'>No Data</p> */}
                        <div className=" mx-auto ">
                            <NoDataFound message="Data Not Found..." 
                            // message2="No upcoming sales are scheduled for this project yet." 
                            // message3="Stay tuned for exciting opportunities to participate in future sales." 
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Activities;