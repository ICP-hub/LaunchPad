import React from 'react';
import { useState } from 'react';
import upcomingImage from '../../assets/images/hero1.png';
import hoverImage from '../../assets/images/hero2.png'; 
import AnimationButton from '../../common/AnimationButton';

const Launch = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex pt-[25%] pb-[50%] md:pb-4  md:pt-[4%] relative">
      {/* Left Section */}
      <div className="w-full  md:w-1/2 flex flex-col justify-center  md:items-start text-start md:text-left py-[5%]  pl-[6%] md:pr-0 pr-[4%] md:pl-[9%]">
        <h1 className=" text-4xl md:text-4xl lg:text-6xl dlg:text-7xl font-semibold mb-6">
          LAUNCH YOUR PROJECT
        </h1>
        <p className=" md:text-lg mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          auctor, nunc at laoreet dapibus, felis ligula scelerisque orci, sit
          amet efficitur mauris lacus vel ex.
        </p>
        <AnimationButton  text="LAUNCH NOW"/>
      </div>

      {/* Right Section for larger screens */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center">
        <div className="relative">
          <div className="w-[380px] h-[380px] rounded-full border-8 border-white flex justify-center items-center">
            <div className="w-[350px] h-[350px] rounded-full border-8 border-black flex justify-center items-center">
              <div className="w-[320px] h-[320px] rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Launch;
