import React,{useState} from "react";
import person1 from "../../../../assets/images/carousel/person1.png";
import { useNavigate } from 'react-router-dom';
import l3 from '../../../../assets/images/carousel/l3.png'
import ProjectCard from "../../Projects/ProjectCard";
import { useSelector } from "react-redux";
import MyProjectCard from "./MyProjectCard";





const ProjectLists = () => {
  const navigate = useNavigate();
  const salesData = useSelector((state)=>state.UserTokensInfo.data)

  // Handle navigation to the projects page
  const handleViewMoreClick2 = () => {
    navigate('/project');
  };
  

  return (
    <div  className="    md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]">
    <div className="flex lg:flex-row flex-wrap gap-6 items-center w-[95%]  m-auto justify-around">
      
      {salesData.map((sale, index) => (
    
        <MyProjectCard projectData={sale} key={index} />
      ))}
    </div>
    </div>
  );
};

export default ProjectLists;
