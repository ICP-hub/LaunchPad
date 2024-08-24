import React, { useState, useEffect } from 'react';
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import l1 from '../../assets/images/carousel/l1.png';
import l2 from '../../assets/images/carousel/l2.png';
import l3 from '../../assets/images/carousel/l3.png';
import l4 from '../../assets/images/carousel/l4.png';
import l5 from '../../assets/images/carousel/l5.png';
import l6 from '../../assets/images/carousel/l6.png';

import person1 from '../../assets/images/carousel/person1.png';
import person2 from '../../assets/images/carousel/person2.png';
import person3 from '../../assets/images/carousel/person3.png';
import person4 from '../../assets/images/carousel/person4.png';
import person5 from '../../assets/images/carousel/person5.png';
import person6 from '../../assets/images/carousel/person6.png';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(5); // Default to 5 slides

  const slides = [
    { id: 1, title: "Catwifhat", subtitle: "Catwifhat", img: person1 ,logo: l1 },
    { id: 2, title: "Catwifhat", subtitle: "Catwifhat", img: person2 ,logo: l2 },
    { id: 3, title: "Catwifhat", subtitle: "Catwifhat", img: person3 ,logo: l3 },
    { id: 4, title: "Catwifhat", subtitle: "Catwifhat", img: person4 ,logo: l4 },
    { id: 5, title: "Catwifhat", subtitle: "Catwifhat", img: person5 ,logo: l5 },
    { id: 6, title: "Catwifhat", subtitle: "Catwifhat", img: person6 ,logo: l6 },
    { id: 7, title: "Catwifhat", subtitle: "Catwifhat", img: person1 ,logo: l1 },
  ];

  useEffect(() => {
    // Adjust the number of slides based on screen width
    const updateSlidesToShow = () => {
      if (window.innerWidth < 1086) {
        setSlidesToShow(3);
      } else if (window.innerWidth < 1282 ) {
        setSlidesToShow(4);
      } else {
        setSlidesToShow(5);
      }
    };

    // Initial check
    updateSlidesToShow();

    // Add event listener for window resize
    window.addEventListener('resize', updateSlidesToShow);

    // Clean up event listener on unmount
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  const handlePrevClick = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - slidesToShow : prev - 1));
  };

  const handleNextClick = () => {
    setCurrentSlide((prev) => (prev === slides.length - slidesToShow ? 0 : prev + 1));
  };

  return (
    <div className="relative flex flex-col px-[9%] dxl:pt-[8%] md:pt-[17%]  lg:pt-[15%]  dxl:pb-[3%] items-center">
      {/* Carousel Content */}
      <div className="flex overflow w-full justify-center space-x-6">
        {slides.slice(currentSlide, currentSlide + slidesToShow).map((slide) => (
          <div key={slide.id} className="relative px-8  pb-40 h-[174px] w-[183px]  rounded-2xl bg-[#252525]">
            <div className="absolute left-1/2 bottom-11 transform -translate-x-1/2 -translate-y-1/2 w-[125px]  rounded-full overflow border-1 border-gray-300">
              <img src={slide.img} alt={slide.title} className="object-cover  " />
              <div className="absolute bottom-0 right-0 w-10 h-10  rounded-full border-1 border-gray-300">
                <img src={slide.logo} alt="small" className="object-cover w-full h-full" />
              </div>
            </div>
            <p className="text-center text-xl font-bold mt-20">{slide.title}</p>
            <p className="text-center text-sm text-gray-500">{slide.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button onClick={handlePrevClick} className="absolute top-[60%] md:left-[3%]  lg:left-[10%] lg:top-[60%]  transform -translate-y-1/2 bg-black p-2">
        <FiArrowLeftCircle size={35} />
      </button>
      <button onClick={handleNextClick} className="absolute top-[60%] md:right-[3%]  lg:right-[10%] lg:top-[60%] transform -translate-y-1/2 bg-black p-2 rounded-full">
        <FiArrowRightCircle size={35} />
      </button>

      {/* Dots */}
      <div className="flex mt-4">
        {slides.slice(0, slidesToShow === 3 ? 2 : 3).map((_, index) => (
          <div key={index} className={`mx-1 h-2 ${currentSlide === index ? 'w-8' : 'w-2'} bg-gray-500 rounded-full transition-all duration-300`}></div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
