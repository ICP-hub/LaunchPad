import React from 'react';
import { Link } from 'react-router-dom';
import circleGif from '../../../assets/images/circle.gif';
import AnimationButton from '../../common/AnimationButton';




const Launch = () => {

  return (
    <div className="flex pt-[25%] pb-[50%] md:pb-4  md:pt-[4%] relative">

      {/* Background Image for screens smaller than md */}
      <div className="absolute top-0 left-0 w-full h-full md:hidden bg-cover bg-center filter blur-[10px] opacity-30">
        <div
          className="w-full h-full bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage: `url(${circleGif})`,
          }}
        />
      </div>

      {/* Left Section */}
      <div className="w-full  md:w-1/2 flex flex-col justify-center   md:items-start text-start md:text-left py-[5%]  pl-[6%] md:pr-0 pr-[4%] md:pl-[9%]">
        <h1 className=" text-4xl md:text-4xl lg:text-6xl font-posterama dlg:text-7xl font-[700] mb-6">
          LAUNCH YOUR PROJECT
        </h1>
        <p className=" md:text-lg mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          auctor, nunc at laoreet dapibus, felis ligula scelerisque orci, sit
          amet efficitur mauris lacus vel ex.
        </p>
        <Link to="/create-prelaunch">
        <AnimationButton text="LAUNCH NOW" />
      </Link>
      </div>

      {/* Right Section for larger screens */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center">
        <div className="relative">
         
           
              <img
                src={circleGif}
                alt="Circle GIF"
                className="w-[370px] h-[370px] rounded-full"
              />
        </div>
      </div>
      
    </div>
  );
};

export default Launch;
