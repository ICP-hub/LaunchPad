import React, { useEffect, useRef } from 'react';
import OurPartner from '../components/HomePageComponent/OurPartners';
import FundList from '../components/HomePageComponent/FundList';
// import Carousel from '../components/HomePageComponent/Carousel';
import Hero from '../components/HomePageComponent/Hero';
import UpcomingSales from '../components/HomePageComponent/UpcomingSales';
import { useDispatch, useSelector } from 'react-redux';
import { upcomingSalesHandlerRequest } from '../StateManagement/Redux/Reducers/UpcomingSales';
import { SuccessfulSalesHandlerRequest } from '../StateManagement/Redux/Reducers/SuccessfulSales';

function Home() {
const dispatch=useDispatch();
const actor = useSelector((currState) => currState.actors.actor);
  // useEffect(()=>{
  //   dispatch(upcomingSalesHandlerRequest()) 
  //   dispatch(SuccessfulSalesHandlerRequest()) 
  // },[actor])
  useEffect(() => {
    if(actor){
    dispatch(upcomingSalesHandlerRequest()) 
    dispatch(SuccessfulSalesHandlerRequest())
    }
  }, [dispatch]);

  const upcomingSalesRef = useRef(null);

  const scrollToUpcomingSales = () => {
    if (upcomingSalesRef.current) {
      upcomingSalesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div>
      <Hero  scrollToUpcomingSales={scrollToUpcomingSales} />
      {/* <Carousel/> */}
      <FundList/>
      <UpcomingSales ref={upcomingSalesRef}/>
      <OurPartner/>
    </div>
  );
}

export default Home;
