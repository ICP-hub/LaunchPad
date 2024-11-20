// import React from 'react';
// import { useState } from 'react';
// import upcomingImage from '../../../assets/images/hero1.png'; 
// import hoverImage from '../../../assets/images/hero2.png'; 

// const Hero = () => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div className="flex pt-[25%] pb-[50%] md:pb-4  md:pt-[4%] relative">
//       {/* Left Section */}
//       <div className="w-full  md:w-1/2 flex flex-col justify-center  md:items-start text-start md:text-left pl-[6%] md:pr-0 pr-[4%] md:pl-[9%]">
//         <h1 className=" text-4xl md:text-4xl lg:text-6xl dlg:text-7xl font-posterama font-semibold mb-6">
//           THE LAUNCHPAD PROTOCOL FOR EVERYONE
//         </h1>
//         <p className=" md:text-lg mb-4">
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
//           auctor, nunc at laoreet dapibus, felis ligula scelerisque orci, sit
//           amet efficitur mauris lacus vel ex.
//         </p>
//         <button type='submit'  className='border-1  font-posterama  bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] 
//              text-black  relative w-[240px] h-[35px]
//                 text-[16px] md:text-[18px] font-[600] rounded-3xl'>
//                 UPCOMING SALES
//             </button>
//       </div>

//       {/* Right Section for larger screens */}
//       <div className="hidden md:flex w-1/2 items-center justify-center relative">
//         <img
//           src={isHovered ? hoverImage : upcomingImage}
//           alt="Hero"
//           className={`transition-transform duration-700 ease-in-out ${isHovered ? 'transform ' : ''}`}
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         />
//       </div>

//       {/* Background Image for smaller screens */}
//       <div
//         className="absolute top-0 left-0 w-full h-full md:hidden bg-cover bg-center filter blur-[10px] opacity-50"
//         style={{ backgroundImage: `url(${upcomingImage})` }}
//       ></div>
//     </div>
//   );
// };

// export default Hero;


import React from "react";
import upcomingImage from "../../../assets/images/hero1.png";

const Hero = ({ scrollToUpcomingSales }) => {
  return (
    <div className="flex pt-[25%] pb-[50%] md:pb-4 md:pt-[4%] relative">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center md:items-start text-start md:text-left pl-[6%] md:pr-0 pr-[4%] md:pl-[9%]">
        <h1 className="text-4xl md:text-4xl lg:text-6xl dlg:text-7xl font-posterama font-semibold mb-6">
          THE LAUNCHPAD PROTOCOL FOR EVERYONE
        </h1>
        <p className="md:text-lg mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          auctor, nunc at laoreet dapibus, felis ligula scelerisque orci, sit
          amet efficitur mauris lacus vel ex.
        </p>
        <button
          type="submit"
          className="border-1 z-10 font-posterama bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-black relative w-[230px] h-[35px] text-[16px] md:text-[18px] font-[600] rounded-3xl"
          onClick={scrollToUpcomingSales}
        >
          UPCOMING SALES
        </button>
      </div>

      {/* Right Section for larger screens */}
      <div className="hidden md:flex w-1/2 items-center justify-center relative">
        <img
          src={upcomingImage}
          alt="Hero"
          className="transition-transform duration-[500ms] ease-[cubic-bezier(0.25, 1, 0.5, 1)] transform-image"
        />
      </div>

      {/* Background Image for smaller screens */}
      <div
        className="absolute top-0 left-0 w-full h-full md:hidden bg-cover bg-center filter blur-[10px] opacity-50"
        style={{ backgroundImage: `url(${upcomingImage})` }}
      ></div>
    </div>
  );
};

export default Hero;
