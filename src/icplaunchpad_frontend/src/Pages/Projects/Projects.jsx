
import React,{useEffect, useState} from "react";
import { TbFilterCheck } from "react-icons/tb";
import { PiArrowsDownUpBold } from "react-icons/pi";
import { useAuth } from "../../StateManagement/useContext/useAuth.jsx";
import ProjectCard from "./ProjectCard.jsx";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";


const ProjectLists = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const location = useLocation();
  const salesData = location.state?.salesData;
  const projectsData= useSelector((state)=>state?.TokensInfo?.data)
 

  return (
    <div  className="upcoming-sales  h-full   md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]">
        <div className="bg-black text-white px-4 xxs1:px-16 ">
      {/* Heading */}
      <h1 className="text-[40px] font-posterama font-bold">PROJECTS</h1>

      {/* Tabs */}
      <div className="flex space-x-8 ss2:space-x-12 my-8">
        <button
          className={`cursor-pointer relative ${
                      selectedTab === "all"
                        ? "before:absolute before:left-0 before:right-0 before:top-7 before:h-[2px] before:bg-gradient-to-r before:from-[#F3B3A7] before:to-[#CACCF5] before:rounded text-transparent bg-clip-text bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]"
                        : ""
                    }`}
          onClick={() => setSelectedTab("all")}
        >
          ALL
        </button>
        <button
          className={`cursor-pointer relative ${
                      selectedTab === "advanced"
                        ? "before:absolute before:left-0 before:right-0 before:top-7 before:h-[2px] before:bg-gradient-to-r before:from-[#F3B3A7] before:to-[#CACCF5] before:rounded text-transparent bg-clip-text bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]"
                        : ""
                    }`}
          onClick={() => setSelectedTab("advanced")}
        >
          ADVANCED
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex  flex-col md:flex-row items-center  justify-center space-x-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-[#444444] text-white p-2 rounded-xl outline-none placeholder-gray-500"
        />
        
        <div className="flex pr-2 gap-5 md:gap-2 md:mt-0 mt-4 w-full md:w-[30%] items-center  justify-center">
        {/* Filter and Sort Buttons */}
        <button className="bg-[#444444] ml-[-2%]  p-2  rounded-lg text-white flex items-center w-full">
        <TbFilterCheck/>
          <span className="md:ml-2">Filter</span>
          
        </button>
        
        <button className="bg-[#444444] p-2 rounded-lg text-white flex items-center w-full">
        <PiArrowsDownUpBold/>
          <span className="ml-2">Sort</span>
          
        </button>
        </div>
      </div>
    </div>

    <div className="flex lg:flex-row flex-col flex-wrap items-center w-[95%] m-auto  justify-around">
      
      {salesData ? salesData.map((sale, index) => (
        <ProjectCard projectData={sale} index={index}/> 
      )) 
      :
      projectsData.map((project, index) => (
        <ProjectCard projectData={project} index={index}/> 
      )) 

    }
    </div>
    </div>
  );
};

export default ProjectLists;

