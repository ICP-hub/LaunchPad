import React,{useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import NoDataFound from "../../../common/NoDataFound";
import { Principal } from "@dfinity/principal";
import ProjectCard from "./ProjectCard";


const ProjectLists = () => {
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const principal = useSelector((currState) => currState.internet.principal);
  
  const [tokensLedger, setTokensLedger] = useState([])
  console.log("Fetched tokens in ProjectLists:", tokensLedger);

  useEffect(() => {
    const fetchUserTokensInfo = async () => {
        const userPrincipal= Principal.fromText(principal)
      try {
        if (actor) {
          const response = await actor.get_user_ledger_ids(userPrincipal);

          if (response && response?.Ok && response?.Ok?.length > 0) {
            setTokensLedger(response?.Ok);
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
    <div className="flex lg:flex-row flex-wrap gap-6 items-center sm:w-[95%]  m-auto justify-around">
      
      {/* {tokens && tokens.map((sale, index) => (
    
        <ProjectCard isUserToken={true} projectData={sale} key={index} />
        
      ))} */}
        {tokensLedger && tokensLedger.length > 0 ? (
          tokensLedger.map((ledger, index) => (
            <ProjectCard ledgerID={ledger} key={index} />
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
