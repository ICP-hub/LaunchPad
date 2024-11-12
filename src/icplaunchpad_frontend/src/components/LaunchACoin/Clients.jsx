import React, { useEffect } from "react";
import person1 from "../../../assets/images/carousel/person1.png";
import { useNavigate } from 'react-router-dom';
import l3 from '../../../assets/images/carousel/l3.png'
import { useDispatch, useSelector } from "react-redux";
import ProjectCard from "../../Pages/Projects/ProjectCard";
import { SuccessfulSalesHandlerRequest } from "../../StateManagement/Redux/Reducers/SuccessfulSales";

  

const Clients = () => {
  const dispatch =useDispatch();

  useEffect(()=>{
    dispatch(SuccessfulSalesHandlerRequest());
  },[])
  
  const salesData = useSelector((state)=> state?.SuccessfulSales?.data)
  const navigate = useNavigate();

  // Handle navigation to the projects page
  const handleViewMoreClick = () => {
    if(salesData.length > 0)
       navigate('/projects', {state:{salesData, saleType:"successfull"} });
  };


  return (
    <div  className=" h-full   md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]">
      <div className="flex justify-between items-center px-[4%] lg:px-[6%] mb-10">
        <h2 className="text-white font-bold font-posterama text-[20px] xxs1:text-3xl">CLIENT SUCCESS STORIES</h2>
        <button onClick={handleViewMoreClick} className="text-white font-posterama hidden xxs1:block underline text-[15px] xxs1:text-xl">
          View More
        </button>
      </div>

    <div className="flex md:flex-row flex-col flex-wrap w-[95%] items-center m-auto justify-around">
      
      { (salesData.length > 0 ) ? salesData.map((sales, index) => (
        (index < 3) && <ProjectCard projectData={sales} saleType="successfull" index={index}/> 
      )) :
      <h1 className="text-xl my-16"> Data Not Found... </h1>
      }
      <button onClick={handleViewMoreClick} className="text-white font-posterama  xxs1:hidden underline text-[20px] mt-6 xxs1:text-xl">
          Load More
        </button>
    </div>
    </div>
  );
};

export default Clients;
