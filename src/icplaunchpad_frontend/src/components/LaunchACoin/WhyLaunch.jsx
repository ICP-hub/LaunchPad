import React from 'react';
import { FaDiscord, FaTwitter, FaTelegramPlane, FaUsers } from 'react-icons/fa';

const WhyLaunch = () => {
  return (
    <div className="container mx-auto px-[9%] py-8 text-center">
      <h2 className="text-3xl font-bold mb-11">WHY LAUNCH WITH US</h2>
      <div className="flex items-center   h-[270px] md:h-[200px]  gap-11 ">
        
        <div className="bg-[#333333]  text-white lg:h-[220px] lg:w-[400px] dxl:h-[220px] dxl:w-[370px] py-9 rounded-lg">
          <p className=" lg:text-[20px] dxl:text-2xl px-[5%] font-bold">RAISE FUNDS PUBLICLY</p>
          <p className="text-center uppercase text-[8px] dxl:text-[15px] px-8 ">Gain access to a worldwide network of committed supporters within an open and decentralized environment.</p>
        </div>

        <div className="h-[200px] md:h-[220px] w-2 rounded-full transition-all duration-500 bg-gradient-to-t from-[#212121] to-[#F3B3A7]"></div>
        
        <div className="bg-[#333333] text-white lg:h-[220px] lg:w-[400px] h-[220px] w-[370px] py-9 rounded-lg">
          <p className="text-2xl px-[10%] font-bold">BUILD A COMMUNITY</p>
          <p className="text-center uppercase text-[15px] px-10">Cultivate and foster your most devoted advocates from the outset. They are your steadfast allies!</p>
        </div>

        <div className="h-[200px] md:h-[220px] w-2 rounded-full transition-all duration-500 bg-gradient-to-t from-[#212121] to-[#F3B3A7]"></div>

        <div className="bg-[#333333] text-white  lg:h-[220px] lg:w-[400px]  h-[220px] w-[370px] py-9 rounded-lg">
          <p className="text-2xl px-[10%] font-bold">DECREASE RISK</p>
          <p className="text-center text-[15px] uppercase px-6">Seize complete command of your fundraising efforts and leverage them to their fullest potential.</p>
        </div>
      </div>
    </div>
  );
};

export default WhyLaunch;
