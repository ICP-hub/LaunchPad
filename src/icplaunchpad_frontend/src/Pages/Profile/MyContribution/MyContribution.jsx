import React,{useEffect, useState} from "react";
import person1 from "../../../../assets/images/carousel/person1.png";
import { useNavigate } from 'react-router-dom';
import l3 from '../../../../assets/images/carousel/l3.png'
import ProjectCard from "../../Projects/ProjectCard";
import MyProjectCard from "./MyProjectCard";
import { useSelector } from "react-redux";





const ProjectLists = () => {
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const principal = useSelector((currState) => currState.internet.principal);
  const [salesData, setSalesData] = useState([])
  console.log("Fetched tokens in ProjectLists:", salesData);

  useEffect(() => {
    const fetchUserTokensInfo = async () => {
      try {
        if (actor) {
          const response = await actor.get_user_tokens_info();
          if (response && response.length > 0) {
            setSalesData(response);
          } else {
            console.log("No tokens data available or empty response.");
          }
        } else {
          console.log("User account has not been created yet.");
        }
      } catch (error) {
        console.error("Error fetching user tokens info:", error.message);
      }
    };

    fetchUserTokensInfo();
  }, [actor]);
  // Handle navigation to the projects page
  // const handleViewMoreClick2 = () => {
  //   navigate('/project');
  // };
  

  return (
    <div  className="    md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]">
    <div className="flex lg:flex-row flex-wrap gap-6 items-center w-[95%]  m-auto justify-around">
      
      {salesData.map((sale, index) => (
    
        <ProjectCard isUserToken={true} projectData={sale} key={index} />
      ))}
    </div>
    </div>
  );
};

export default ProjectLists;
