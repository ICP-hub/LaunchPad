import React,{useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import NoDataFound from "../../../common/NoDataFound";
import { Principal } from "@dfinity/principal";
import ProjectCard from "./ProjectCard";
import ProjectCardSkeleton from "../../../common/SkeletonUI/ProjectCard";


const ProjectLists = () => {

 const tokensLedger= useSelector((state)=>state?.UserTokenLedgerIds)
  console.log("Fetched tokensLedger Ids:", tokensLedger);


  return (
    <div  className="    md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]">
    <div className="flex lg:flex-row flex-wrap gap-6 items-center sm:w-[95%]  m-auto justify-around">
      
      {/* {tokens && tokens.map((sale, index) => (
    
        <ProjectCard isUserToken={true} projectData={sale} key={index} />
        
      ))} */}
        {tokensLedger?.loading ?
        <ProjectCardSkeleton count={6} cardType={'AllTokens'} />
        :
        (tokensLedger?.data && tokensLedger?.data.length > 0) ? (
          tokensLedger?.data.map((ledger, index) => (
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
