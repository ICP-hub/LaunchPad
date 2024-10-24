import React from "react";
import person1 from "../../../assets/images/carousel/person1.png";
import { useNavigate } from 'react-router-dom';
import l3 from '../../../assets/images/carousel/l3.png'
import { useSelector } from "react-redux";
import ProjectCard from "../../Pages/Projects/ProjectCard";


const UpcomingSales = () => {
  const navigate = useNavigate();
  const salesData = useSelector((state)=>state.upcomingSales.data)
 
  // Handle navigation to the projects page
  const handleViewMoreClick = () => {
    navigate('/projects', {state:{salesData}} );
  };


  return (
    <div  className="upcoming-sales h-full mt-8   md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]">
      <div className="flex justify-between items-center px-[6%] mb-10">
        <h2 className="text-white font-bold font-posterama text-[24px] xxs1:text-3xl">UPCOMING SALES</h2>
        <button onClick={handleViewMoreClick} className="text-white hidden xxs1:block font-posterama underline text-[15px] xxs1:text-xl">
          View More
        </button>
      </div>

    <div className="flex lg:flex-row flex-col items-center flex-wrap w-[95%] m-auto justify-around">
      
      {salesData && salesData.map((sale, index) => (
      
       (index < 3) && <ProjectCard projectData={sale} index={index}/>
      ))}
      <button onClick={handleViewMoreClick} className="text-white mt-4  xxs1:hidden font-posterama underline text-[20px] xxs1:text-xl">
          LOAD MORE
        </button>
    </div>
    </div>
  );
};

export default UpcomingSales;
