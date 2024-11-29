import React,{useEffect, useState} from "react";
import person1 from "../../../../assets/images/carousel/user.png";
import { useNavigate } from 'react-router-dom';
import l3 from '../../../../assets/images/carousel/l3.png'
import ProjectCard from "../../Projects/ProjectCard";
import MyProjectCard from "./MyProjectCard";
import { useSelector } from "react-redux";
import NoDataFound from "../../../common/NoDataFound";





const ProjectLists = () => {
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const principal = useSelector((currState) => currState.internet.principal);
  const [tokens, setTokens] = useState([])
  console.log("Fetched tokens in ProjectLists:", tokens);

  useEffect(() => {
    const fetchUserTokensInfo = async () => {
      try {
        if (actor) {
          const response = await actor.get_user_tokens_info();

          if (response && response.length > 0) {
            setTokens(response);
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
      
      {/* {tokens && tokens.map((sale, index) => (
    
        <ProjectCard isUserToken={true} projectData={sale} key={index} />
        
      ))} */}
        {tokens && tokens.length > 0 ? (
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
