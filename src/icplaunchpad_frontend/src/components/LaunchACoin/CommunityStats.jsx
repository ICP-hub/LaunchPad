import React from 'react';
import { FaDiscord, FaTwitter, FaTelegramPlane, FaUsers } from 'react-icons/fa';

const CommunityStats = () => {
  return (
    <div className="container mx-auto px-[6%] lg:px-[9%] py-12 text-center">
      <h2 className="text-[26px] ss2:text-3xl font-bold font-posterama  mb-4">OUR STRONG COMMUNITY</h2>
      <p className="text-gray-400 mb-8">
        We have a global network of passionate supporters ready to back innovative projects like yours.
      </p>
      <div className="grid  ss2:grid-cols-2  lg:grid-cols-4 gap-6">
        <div className="bg-[#333333] text-white p-6 rounded-lg">
          <FaDiscord className=" text-4xl mx-auto mb-4  " />
          <p className=" text-[18px] ss2:text-2xl font-bold ">+100K</p>
          <p className=" font-medium transition-all duration-500 bg-gradient-to-r  from-[#F3B3A7] to-[#CACCF5] text-transparent bg-clip-text ">DISCORD MEMBERS</p>
        </div>
        <div className="bg-[#333333] text-white p-6 rounded-lg">
          <FaTwitter className="text-4xl  mx-auto mb-4" />
          <p className="text-2xl font-bold">+100K</p>
          <p className="font-medium transition-all duration-500 bg-gradient-to-r  from-[#F3B3A7] to-[#CACCF5] text-transparent bg-clip-text">TWITTER FOLLOWERS</p>
        </div>
        <div className="bg-[#333333] text-white p-6 rounded-lg">
          <FaTelegramPlane className="text-4xl mx-auto mb-4" />
          <p className="text-2xl font-bold">+100K</p>
          <p className="font-medium transition-all duration-500 bg-gradient-to-r  from-[#F3B3A7] to-[#CACCF5] text-transparent bg-clip-text">TELEGRAM MEMBERS</p>
        </div>
        <div className="bg-[#333333] text-white p-6 rounded-lg">
          <FaUsers className="text-4xl mx-auto mb-4 " />
          <p className="text-2xl font-bold">+100K</p>
          <p className="font-medium transition-all duration-500 bg-gradient-to-r  from-[#F3B3A7] to-[#CACCF5] text-transparent bg-clip-text">IDO ALLOCATIONS</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityStats;
