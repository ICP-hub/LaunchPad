import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../../Pages/Projects/ProjectCard";
import { useSelector } from "react-redux";
import NoDataFound from "../../common/NoDataFound";
import ProjectCardSkeleton from "../../common/SkeletonUI/ProjectCard";

const UpcomingSales = React.forwardRef((props, ref) => {
  const navigate = useNavigate();
  // const actor = useSelector((currState) => currState.actors.actor);
  const salesData = useSelector((state) => state.upcomingSales);

  // Handle navigation to the projects page
  const handleViewMoreClick = () => {
    if (salesData?.data && salesData?.data.length > 0) {
      navigate("/projects", {
        state: {sale_Type: "Upcoming" },
      });
    }
  };

  return (
    <div
      ref={ref}
      className="upcoming-sales h-full mt-8 md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]"
    >
      <div className="flex justify-between items-center px-[4%] md:px-[9%] mb-10 mx-auto">
        <h2 className="text-white font-bold font-posterama text-[24px] xxs1:text-3xl">
          UPCOMING SALES
        </h2>
        {salesData?.data && salesData?.data.length > 3 && (
          <button
            onClick={handleViewMoreClick}
            className="text-white hidden sm:block font-posterama underline text-[15px] xxs1:text-xl"
          >
            View More
          </button>
        )}
      </div>

      <div className="flex lg:flex-row flex-col flex-wrap items-center md:px-[8.5%] m-auto gap-12 justify-start">
        { salesData?.loading ? (
          <ProjectCardSkeleton count={3} />
        ) : (salesData?.data && salesData?.data.length > 0 ? (
          salesData?.data.slice(0, 3).map((sale, index) => (
            <ProjectCard
              key={index}
              initial_Total_supply={sale[1] || null}
              projectData={sale[0]}
              saleType="upcoming"
              index={index}
            />
          ))
        ) : (
          <div className="mx-auto">
            <NoDataFound
              message="Data Not Found..."
              message2="No upcoming sales are scheduled for this project yet."
              message3="Stay tuned for exciting opportunities to participate in future sales."
            />
          </div>
        )
       )}

        {salesData?.data && salesData?.data.length > 3 && (
          <button
            onClick={handleViewMoreClick}
            className="text-white mt-4 sm:hidden font-posterama underline text-[20px] xxs1:text-xl"
          >
            LOAD MORE
          </button>
        )}
      </div>
    </div>
  );
});

export default UpcomingSales;
