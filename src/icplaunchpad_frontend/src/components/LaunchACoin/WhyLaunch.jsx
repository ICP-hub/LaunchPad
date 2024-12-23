import React, { useState, useEffect } from 'react';
import Slider from 'react-slick'; // Import react-slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const isMobile = () => window.innerWidth <= 480;

const WhyLaunch = () => {
  const [isMobileView, setIsMobileView] = useState(isMobile());

  useEffect(() => {
    const handleResize = () => setIsMobileView(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const carouselSettings = {
    dor:true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="container mx-auto px-[10%] ss2:px-[7%] lg:px-[9%] py-8 font-posterama text-center">
      <h2 className="text-[20px] ss2:text-[22px] xxs1:text-3xl font-bold mb-7 xxs1:mb-11">Why Launch with Us?</h2>

      {isMobileView ? (
        // Carousel for mobile view
        <Slider {...carouselSettings}>
          <div className="bg-[#333333] h-[220px] w-[300px] text-center py-9  mr-2">
            <p className="text-[20px] dxl:text-2xl px-[5%] pb-2 font-bold">Raise Funds Openly</p>
            <p className="text-center uppercase text-[11px] ss2:text-[14px]  px-8">
              Tap into a global network of passionate supporters in a transparent, decentralized way.
            </p>
          </div>
          <div className="bg-[#333333] h-[220px] w-[300px] py-9  mr-12">
            <p className="text-[20px] dxl:text-2xl px-[5%] pb-2 font-bold">BUILD A COMMUNITY</p>
            <p className="text-center uppercase text-[11px] ss2:text-[14px]   px-8">
              Grow a loyal fanbase from day one—your biggest advocates will be with you every step.
            </p>
          </div>
          <div className="bg-[#333333] h-[220px] w-[300px] py-9  mr-12">
            <p className=" text-[20px] dxl:text-2xl px-[5%] pb-2 font-bold">Minimize Risk</p>
            <p className="text-center uppercase text-[11px] ss2:text-[14px]   px-8">
              Take control of your fundraising and maximize your project's potential.
            </p>
          </div>
        </Slider>
      ) : (
        // Desktop view with static layout
        <div className="flex items-center justify-center h-[270px] md:h-[200px] gap-4 lg:gap-11">
          <div className="bg-[#333333] h-[220px] w-[400px] py-9 rounded-lg">
              <p className="lg:text-[20px] dxl:text-2xl px-[5%] pb-2 font-bold">Raise Funds Openly</p>
            <p className="text-center uppercase text-[7px] sm1:text-[8px] md:text-[10px] md1:text-[11px] dxl:text-[14px] px-4 md:px-8">
                Tap into a global network of passionate supporters in a transparent, decentralized way.
            </p>
          </div>

          <div className="hidden sm1:block h-[200px] md:h-[220px] w-2 rounded-full transition-all duration-500 bg-gradient-to-t from-[#212121] to-[#F3B3A7]"></div>

          <div className="bg-[#333333] h-[220px] w-[400px] py-9 rounded-lg">
            <p className="lg:text-[20px] dxl:text-2xl px-[5%] pb-2 font-bold">BUILD A COMMUNITY</p>
            <p className="text-center uppercase text-[7px] sm1:text-[8px]  md:text-[10px] md1:text-[11px] dxl:text-[14px] px-4 md:px-8">
                Grow a loyal fanbase from day one—your biggest advocates will be with you every step.
            </p>
          </div>

          <div className="hidden sm1:block h-[200px] md:h-[220px] w-2 rounded-full transition-all duration-500 bg-gradient-to-t from-[#212121] to-[#F3B3A7]"></div>

          <div className="bg-[#333333] h-[220px] w-[400px] py-9 rounded-lg">
              <p className="lg:text-[20px] dxl:text-2xl px-[5%] pb-2 font-bold">Minimize Risk</p>
            <p className="text-center uppercase text-[7px] sm1:text-[8px] md:text-[10px] md1:text-[11px] dxl:text-[14px] px-4 md:px-8">
                Take control of your fundraising and maximize your project's potential.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhyLaunch;
