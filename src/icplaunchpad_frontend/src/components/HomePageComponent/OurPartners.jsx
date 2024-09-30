import React from 'react';
import partner from '../../../assets/images/partner.png'

const OurPartner = () => {
  return (
    <div className="my-8 px-[9%]">
      {/* Heading */}
      <h2 className="text-start text-2xl md:text-3xl font-posterama font-bold text-white mb-6">
        OUR PARTNERS
      </h2>

      {/* Partner Images and Borders */}
      <div className="flex  items-center h-[190px] md:h-[200px] justify-between">
        {/* Partner 1 */}
        <div className="text-center hidden  xxs1:block">
          <img
            src={partner}
            alt="Partner 1"
            className="mx-auto mb-2   xxs1:w-[80px]  sm:w-[110px]  md1:w-[130px] "
            draggable="false"
          />
          <p className="text-sm md:text-lg font-medium font-posterama text-white">NAME</p>
        </div>

        {/* Thick Border */}
        <div className=" xxs1:h-[140px] sm3:h-[175px] md:h-[190px] xxs1:w-1  md:w-2 rounded-full transition-all duration-500 bg-gradient-to-t from-[#212121] to-[#F3B3A7]"></div>

        {/* Partner 2 */}
        <div className="text-center  hidden xxs1:block">
          <img
            src={partner}
            alt="Partner 2"
            className="mx-auto mb-2 xxs1:w-[80px]  sm:w-[110px]  md1:w-[130px]"
            draggable="false"
          />
          <p className="text-sm md:text-lg font-medium text-white">NAME</p>
        </div>

        <div className="h-[180px] w-2  ml-[-90px]  xxs1:ml-0 xxs1:h-[140px] sm3:h-[175px] md:h-[190px] xxs1:w-1  md:w-2 rounded-full transition-all duration-500 bg-gradient-to-t from-[#212121] to-[#F3B3A7]"></div>

        {/* Partner 3 */}
        <div className="text-center mr-[10px] xxs1:mr-0">
          <img
            src={partner}
            alt="Partner 3"
            className="mx-auto mb-2 xxs1:w-[80px]  sm:w-[110px]  md1:w-[130px]"
            draggable="false"
          />
          <p className="text-sm md:text-lg font-medium text-white">NAME</p>
        </div>

        <div className=" h-[180px] w-2  xxs1:h-[140px] sm3:h-[175px] md:h-[190px] xxs1:w-1 md:w-2 rounded-full transition-all duration-500 bg-gradient-to-t from-[#212121] to-[#F3B3A7]"></div>
      
        {/* partner 4 */}
        <div className="text-center hidden xxs1:block">
          <img
            src={partner}
            alt="Partner 3"
            className="mx-auto mb-2 xxs1:w-[80px]  sm:w-[110px]  md1:w-[130px]"
            draggable="false"
          />
          <p className="text-sm md:text-lg font-medium text-white">NAME</p>
        </div>

    

      </div>
    </div>
  );
};

export default OurPartner;
