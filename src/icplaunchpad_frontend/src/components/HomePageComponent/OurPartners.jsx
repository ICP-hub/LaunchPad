import React from 'react';
import partner from '../../assets/images/partner.png'


const OurPartner = () => {
  return (
    <div className="my-8 px-[9%]">
      {/* Heading */}
      <h2 className="text-start text-3xl font-bold text-white mb-6">
        OUR PARTNERS
      </h2>

      {/* Partner Images and Borders */}
      <div className="flex items-center h-[270px] justify-between " >
        {/* Partner 1 */}
        <div className="text-center">
          <img
            src={partner}
            alt="Partner 1"
            className="mx-auto mb-2 w-[175px] h-[178px]"
            draggable="false"
          />
          <p className="text-lg font-medium text-white">NAME </p>
        </div>

        {/* Thick Border */}
        <div className="h-[269px]  w-2 rounded-full  transition-all duration-500 bg-gradient-to-t  
        font-[900]  from-[#212121] to-[#CACCF5] text-transparent bg-clip-text'"></div>

        {/* Partner 2 */}
        <div className="text-center">
          <img
            src={partner}
            alt="Partner 1"
            className="mx-auto mb-2 w-[175px] h-[178px]"
            draggable="false"
          />
          <p className="text-lg font-medium text-white">NAME </p>
        </div>

        <div className="h-[269px]  w-2 rounded-full  transition-all duration-500 bg-gradient-to-t  
        font-[900]  from-[#212121] to-[#CACCF5] text-transparent bg-clip-text'"></div>

        {/* Partner 3 */}
        <div className="text-center">
          <img
            src={partner}
            alt="Partner 1"
            className="mx-auto mb-2 w-[175px] h-[178px]"
            draggable="false"
          />
          <p className="text-lg font-medium text-white">NAME </p>
        </div>

        <div className="h-[269px]  w-2 rounded-full  transition-all duration-500 bg-gradient-to-t  
        font-[900]  from-[#212121] to-[#CACCF5] text-transparent bg-clip-text'"></div>

        {/* Partner 4 */}
        <div className="text-center">
          <img
            src={partner}
            alt="Partner 1"
            className="mx-auto mb-2 w-[175px] h-[178px]"
            draggable="false"
          />
          <p className="text-lg font-medium text-white">NAME </p>
        </div>
      </div>
    </div>
  );
};

export default OurPartner;
