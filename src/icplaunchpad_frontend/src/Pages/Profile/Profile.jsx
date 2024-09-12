import React from 'react';
import GradientText from '../../common/GradientText';
const Profile = () => {
    return (
        <div className="bg-black text-white font-posterama p-8 max-w-[1170px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col items-start bg-[#FFFFFF1A] p-8 pl-[100px] rounded-2xl gap-12 mb-6">
                <p className="text-[19px] font-inter">
                    Connect as kjgr451gv7ogj9cgg8g ik 9i6v68u8u
                </p>
                <div className="flex  space-x-6">
                    <button className="bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]  text-black py-2 px-4 rounded-2xl">
                        Share Your Profile
                    </button>
                    <button className="bg-transparent border border-gray-500 py-2 px-4 w-[200px] rounded-2xl">
                    <GradientText>LOGOUT</GradientText>
                    </button>
                </div>
            </div>

            {/* Body Section */}
            
            <div className="bg-[#FFFFFF1A]  p-6  rounded-2xl">
            <ul className="flex justify-between text-sm ml-[50px] pb-2">
                        <li className="pb-2 text-white border-b-2 border-purple-500 cursor-pointer">Activities</li>
                        <li className="cursor-pointer hover:text-white">Affiliate</li>
                        <li className="cursor-pointer hover:text-white">Favorited</li>
                        <li className="cursor-pointer hover:text-white">Recently Viewed</li>
                        <li className="cursor-pointer hover:text-white">My Contribution</li>
                    </ul>
                {/* Investment Summary */}
                <div className='flex gap-20'>
                <div className="grid grid-col gap-2 pt-14 ml-8">
                    <div className="text-start">
                        <p>Total Pool Invested</p>
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
                <div className="mt-6">
                   

                    {/* Transaction Table */}
                    <div className="bg-[#FFFFFF0A] w-[750px] h-[275px]  mt-4 rounded-2xl text-center ">
                        <div className="grid grid-cols-5 bg-[#3f3d3d] m-0 py-4  rounded-2xl text-xs mb-4 ">
                            <span>Name</span>
                            <span>Date</span>
                            <span>Amount</span>
                            <span>Type</span>
                            <span>Transaction</span>
                        </div>
                        
                        <p className='mt-24'>No Data</p>
                        
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Profile;
