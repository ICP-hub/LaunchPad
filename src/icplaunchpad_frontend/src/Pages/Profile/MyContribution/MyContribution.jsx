import React,{useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import ProjectCard from "../../Projects/ProjectCard";
import { useSelector } from "react-redux";
import NoDataFound from "../../../common/NoDataFound";
import ProjectCardSkeleton from "../../../common/SkeletonUI/ProjectCard";



const ProjectLists = () => {
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);
  const [isLoading, setIsLoading]= useState(true);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const principal = useSelector((currState) => currState.internet.principal);
 
  const tokens= useSelector((state)=>state?.UserTokensInfo?.data)
  console.log("Fetched tokens in ProjectLists:", tokens);

  useEffect(()=>{
    if(tokens){
      setIsLoading(false)
    }
  },[tokens])
  

  return (
    <div  className="    md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]">
    <div className="flex lg:flex-row flex-wrap gap-6 items-center sm:w-[95%]  m-auto justify-around">
      
      {/* {tokens && tokens.map((sale, index) => (
    
        <ProjectCard isUserToken={true} projectData={sale} key={index} />
        
      ))} */}
        {isLoading ? 
        <ProjectCardSkeleton count={5} />
        :
        (tokens && tokens.length > 0) ? (
          tokens.map((sale, index) => (
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
