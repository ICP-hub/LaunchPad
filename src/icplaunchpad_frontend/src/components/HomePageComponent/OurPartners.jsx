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
      <div className="flex items-center h-[270px] md:h-[200px] justify-between">
        {/* Partner 1 */}
        <div className="text-center">
          <img
            src={partner}
            alt="Partner 1"
            className="mx-auto mb-2 w-[175px] h-[178px] md:w-[130px] md:h-[130px]"
            draggable="false"
          />
          <p className="text-lg md:text-sm font-medium text-white">NAME</p>
        </div>

        {/* Thick Border */}
        <div className="h-[269px] md:h-[190px] w-2 rounded-full transition-all duration-500 bg-gradient-to-t from-[#212121] to-[#CACCF5]"></div>

        {/* Partner 2 */}
        <div className="text-center">
          <img
            src={partner}
            alt="Partner 2"
            className="mx-auto mb-2 w-[175px] h-[178px] md:w-[130px] md:h-[130px]"
            draggable="false"
          />
          <p className="text-lg md:text-sm font-medium text-white">NAME</p>
        </div>

        <div className="h-[269px] md:h-[190px] w-2 rounded-full transition-all duration-500 bg-gradient-to-t from-[#212121] to-[#CACCF5]"></div>

        {/* Partner 3 */}
        <div className="text-center">
          <img
            src={partner}
            alt="Partner 3"
            className="mx-auto mb-2 w-[175px] h-[178px] md:w-[130px] md:h-[130px]"
            draggable="false"
          />
          <p className="text-lg md:text-sm font-medium text-white">NAME</p>
        </div>

        <div className="h-[269px] md:h-[190px] w-2 rounded-full transition-all duration-500 bg-gradient-to-t from-[#212121] to-[#CACCF5]"></div>

        {/* Partner 4 */}
        <div className="text-center">
          <img
            src={partner}
            alt="Partner 4"
            className="mx-auto mb-2 w-[175px] h-[178px] md:w-[130px] md:h-[130px]"
            draggable="false"
          />
          <p className="text-lg md:text-sm font-medium text-white">NAME</p>
        </div>
      </div>
    </div>
  );
};

export default OurPartner;
