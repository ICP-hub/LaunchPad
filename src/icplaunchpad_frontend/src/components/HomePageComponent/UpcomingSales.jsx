import React from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import ProjectCard from "../../Pages/Projects/ProjectCard";

const UpcomingSales = React.forwardRef((props, ref) => {
  const navigate = useNavigate();
  const salesData = useSelector((state) => state.upcomingSales.data);

  // Handle navigation to the projects page
  const handleViewMoreClick = () => {
    if (salesData.length > 0)
      navigate('/projects', { state: { salesData,saleType:"upcoming" } });
  };

  return (
    <div ref={ref} className="upcoming-sales h-full mt-8 md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]">
      <div className="flex justify-between items-center px-[6%] mb-10">
        <h2 className="text-white font-bold font-posterama text-[24px] xxs1:text-3xl">UPCOMING SALES</h2>
        <button onClick={handleViewMoreClick} className="text-white hidden xxs1:block font-posterama underline text-[15px] xxs1:text-xl">
          View More
        </button>
      </div>

      <div className="flex lg:flex-row flex-col items-center flex-wrap w-[95%] m-auto justify-around">
        {salesData.length > 0 ? (
          salesData.slice(0, 3).map((sale, index) => (
            <ProjectCard key={index} projectData={sale} saleType="upcoming" index={index} />
          ))
        ) : (
          <h1 className="text-xl my-16"> Data Not Found... </h1>
        )}
        <button onClick={handleViewMoreClick} className="text-white mt-4 xxs1:hidden font-posterama underline text-[20px] xxs1:text-xl">
          LOAD MORE
        </button>
      </div>
    </div>
  );
});

export default UpcomingSales;
