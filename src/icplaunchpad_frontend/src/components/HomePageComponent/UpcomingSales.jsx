import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../../Pages/Projects/ProjectCard";
import { useSelector } from "react-redux";

const UpcomingSales = React.forwardRef((props, ref) => {
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);

  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchUpcomingSales();
  }, [actor]); // Add actor to the dependency array

  // Function to fetch upcoming sales
  async function fetchUpcomingSales() {
    try {
      if (actor) {
        const response = await actor.get_upcoming_sales();
        setSalesData(response || []); // Set to an empty array if the response is undefined/null
      } else {
        console.log("User account has not been created yet.");
      }
    } catch (error) {
      console.error("An error occurred while fetching upcoming sales:", error);
    }
  }

  // Handle navigation to the projects page
  const handleViewMoreClick = () => {
    if (salesData.length > 0) {
      navigate("/projects", { state: { salesData, sale_Type: "Upcoming" } });
    }
  };

  return (
    <div
      ref={ref}
      className="upcoming-sales h-full mt-8 md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]"
    >
      <div className="flex justify-between items-center px-[6%] mb-10">
        <h2 className="text-white font-bold font-posterama text-[24px] xxs1:text-3xl">
          UPCOMING SALES
        </h2>
        {salesData.length > 0 && (
          <button
            onClick={handleViewMoreClick}
            className="text-white hidden xxs1:block font-posterama underline text-[15px] xxs1:text-xl"
          >
            View More
          </button>
        )}
      </div>

      <div className="flex lg:flex-row flex-col flex-wrap items-center w-[95%] m-auto gap-24 justify-start">
        {salesData.length > 0 ? (
          salesData.slice(0, 3).map((sale, index) => (
            <ProjectCard
              key={index}
              projectData={sale}
              saleType="upcoming"
              index={index}
            />
          ))
        ) : (
          <h1 className="text-xl my-16">Data Not Found...</h1>
        )}
        {salesData.length > 3 && (
          <button
            onClick={handleViewMoreClick}
            className="text-white mt-4 xxs1:hidden font-posterama underline text-[20px] xxs1:text-xl"
          >
            LOAD MORE
          </button>
        )}
      </div>
    </div>
  );
});

export default UpcomingSales;
