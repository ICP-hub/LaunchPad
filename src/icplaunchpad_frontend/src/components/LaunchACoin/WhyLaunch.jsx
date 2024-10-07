import React from 'react';

const WhyLaunch = () => {
  return (
    <div className="container   mx-auto sm1:px-[9%] py-8 font-posterama text-center">
      <h2 className=" text-[20px] ss2:text-[22px] xxs1:text-3xl font-bold mb-7 xxs1:mb-11">WHY LAUNCH WITH US</h2>
      <div className="flex items-center   justify-center  h-[270px] md:h-[200px] gap-4 lg:gap-11 ">
        
        <div className="bg-[#333333] hidden sm1:block h-[220px] w-[400px]  py-9 rounded-lg ">
          <p className=" lg:text-[20px] dxl:text-2xl px-[5%] pb-2 font-bold">RAISE FUNDS PUBLICLY</p>
          <p className="text-center uppercase text-[8px] md:text-[10px] md1:text-[11px] dxl:text-[14px] px-8 ">Gain access to a worldwide network of committed supporters within an open and decentralized environment.</p>
        </div>

        <div className=" hidden sm1:block h-[200px] md:h-[220px] w-2 rounded-full transition-all duration-500 bg-gradient-to-t from-[#212121] to-[#F3B3A7]"></div>
        
        <div className="bg-[#333333]   h-[220px] w-[400px]  py-9 rounded-lg ">
          <p className=" text-2xl sm1:text-[15px] lg:text-[20px]  dxl:text-2xl px-[10%] pb-2 font-bold">BUILD A COMMUNITY</p>
          <p className="text-center uppercase  text-[15px] sm1:text-[7px] md:text-[10px] md1:text-[11px] dxl:text-[14px] px-4 sm:px-10">Cultivate and foster your most devoted advocates from the outset. They are your steadfast allies!</p>
        </div>

        <div className="hidden sm1:block  h-[200px] md:h-[220px] w-2 rounded-full transition-all duration-500 bg-gradient-to-t from-[#212121] to-[#F3B3A7]"></div>

        <div className="bg-[#333333] hidden sm1:block  h-[220px] w-[400px]   py-9 rounded-lg">
          <p className="lg:text-[20px]  dxl:text-2xl px-[10%] pb-2 font-bold">DECREASE RISK</p>
          <p className="text-center text-[7px] md:text-[12px] dxl:text-[14px] uppercase px-6">Seize complete command of your fundraising efforts and leverage them to their fullest potential.</p>
        </div>
      </div>
    </div>
  );
};

export default WhyLaunch;
