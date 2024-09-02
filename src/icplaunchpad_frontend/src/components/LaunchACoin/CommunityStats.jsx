import React from 'react';
import { FaDiscord, FaTwitter, FaTelegramPlane, FaUsers } from 'react-icons/fa';

const CommunityStats = () => {
  return (
    <div className="container mx-auto px-[9%] py-12 text-center">
      <h2 className="text-3xl font-bold mb-4">OUR STRONG COMMUNITY</h2>
      <p className="text-gray-400 mb-8">
        We maintain a worldwide distributed network of dedicated supporters who are keen on backing innovative projects, such as yours.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#333333] text-white p-6 rounded-lg">
          <FaDiscord className="text-4xl mx-auto mb-4  " />
          <p className="text-2xl font-bold ">+100K</p>
          <p className=" font-medium transition-all duration-500 bg-gradient-to-r  from-[#F3B3A7] to-[#CACCF5] text-transparent bg-clip-text">DISCORD MEMBERS</p>
        </div>
        <div className="bg-[#333333] text-white p-6 rounded-lg">
          <FaTwitter className="text-4xl mx-auto mb-4" />
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
