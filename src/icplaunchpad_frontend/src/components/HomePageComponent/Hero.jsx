import React from 'react';
import { useState } from 'react';
import upcomingImage from '../../assets/images/hero1.png'; // Replace with actual image path
import hoverImage from '../../assets/images/hero2.png'; // Replace with actual image path
import AnimationButton from '../../common/AnimationButton';

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex pt-[4%] ">
      {/* Left Section */}
      <div className="w-1/2 flex flex-col justify-center pl-[9%]">
        <h1 className="text-7xl font-bold mb-6">
          THE LAUNCHPAD PROTOCOL FOR EVERYONE
        </h1>
        <p className="text-lg mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          auctor, nunc at laoreet dapibus, felis ligula scelerisque orci, sit
          amet efficitur mauris lacus vel ex.
        </p>
        <AnimationButton text="UPCOMING SALES"/>
      </div>

      {/* Right Section */}
      <div className="w-1/2  flex items-center justify-center relative">
        <img
          src={isHovered ? hoverImage : upcomingImage}
          alt="Hero"
          className={`transition-transform duration-700  ease-in-out ${isHovered ? 'transform ' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      </div>
    </div>
  );
};

export default Hero;
