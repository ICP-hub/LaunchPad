import React, { useEffect, useState } from "react";
import person1 from "../../../assets/images/carousel/user.png";
import { useNavigate } from 'react-router-dom';
import l3 from '../../../assets/images/carousel/l3.png'
import ProjectCard from "../../Pages/Projects/ProjectCard";
import { useSelector } from "react-redux";
import NoDataFound from "../../common/NoDataFound";
import ProjectCardSkeleton from "../../common/SkeletonUI/ProjectCard";

  

const Clients = () => {
  
  
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);
  const [salesData, setSuccessfullSalesData] = useState([]);
  const [isLoading, setIsLoading]=useState(true)

  console.log("Fetched tokens in ProjectLists:", salesData);

  useEffect(() => {
    // Fetch token information when the component mounts
    const fetchUserTokensInfo = async () => {
      try {
        if (actor) {
          const response = await actor.get_successful_sales();
          setIsLoading(false);
          if (response && response?.Ok?.length > 0) {
            setSuccessfullSalesData(response.Ok);
            
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
  const handleViewMoreClick = () => {
    if(salesData && salesData.length > 0)
       navigate('/projects', {state:{salesData, sale_Type:"Successful"} });
  };


  return (
    <div  className=" h-full   md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]">
      <div className="flex justify-between items-center px-[4%] md:px-[9%] mb-10 mx-auto">
        <h2 className="text-white font-bold font-posterama text-[20px] xxs1:text-3xl">CLIENT SUCCESS STORIES</h2>
        {salesData && salesData.length > 0 && (<button onClick={handleViewMoreClick} className="text-white font-posterama hidden sm:block underline text-[15px] xxs1:text-xl">
          View More
        </button>)
        }
      </div>

    <div className="flex lg:flex-row flex-col flex-wrap items-center md:px-[8.5%] m-auto gap-12 justify-start">
      
      { isLoading ?
      <ProjectCardSkeleton count={3}/>
      :
       (salesData && salesData.length > 0 ) ? salesData.map((sales, index) => (
        (index < 3) && <ProjectCard initial_Total_supply={ sales[1] || null} projectData={sales[0]} saleType="successfull" index={index}/> 
      )) :
      // <h1 className="text-xl mx-auto my-16"> Data Not Found... </h1>
      <div className="mx-auto">
            <NoDataFound message="No Successful Sales Found..." message2="No tokens have been successfully raised for this project yet." message3="Kickstart your fundraising journey by creating and sharing your campaign." />
      </div>
      }
      
      <button onClick={handleViewMoreClick} className="text-white font-posterama  sm:hidden underline text-[20px] mt-6 xxs1:text-xl">
          Load More
        </button>
    </div>
    </div>
  );
};

export default Clients;
