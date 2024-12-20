import React,{useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import ProjectCard from "../../Projects/ProjectCard";
import { useSelector } from "react-redux";
import NoDataFound from "../../../common/NoDataFound";
import ProjectCardSkeleton from "../../../common/SkeletonUI/ProjectCard";



const ProjectLists = () => {
   
  const tokens= useSelector((state)=>state?.UserTokensInfo)
  
  console.log("Fetched tokens in ProjectLists:", tokens);
  

  return (
    <div  className="    md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]">
    <div className="flex lg:flex-row flex-wrap gap-6 items-center sm:w-[95%]  m-auto justify-around">
      

        {tokens?.loading ? 
        <ProjectCardSkeleton count={5} />
        :
        (tokens?.data && tokens?.data.length > 0) ? (
          tokens?.data.map((sale, index) => (
            <ProjectCard isUserToken={true} projectData={sale} key={index} />
          ))
        ) : (
            <NoDataFound
              message="No Contributions Yet"
              message2="It looks like no users have contributed to your project so far."
              message3="Encourage your community to get involved and help bring your project to life!"
            />

        )}


    </div>
    </div>
  );
};

export default ProjectLists;
