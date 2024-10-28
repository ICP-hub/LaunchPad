import React, { useRef } from 'react';
import OurPartner from '../components/HomePageComponent/OurPartners';
import FundList from '../components/HomePageComponent/FundList';
import Carousel from '../components/HomePageComponent/Carousel';
import Hero from '../components/HomePageComponent/Hero';
import UpcomingSales from '../components/HomePageComponent/UpcomingSales';

function Home() {
  const upcomingSalesRef = useRef(null);

  const scrollToUpcomingSales = () => {
    if (upcomingSalesRef.current) {
      upcomingSalesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div>
      <Hero  scrollToUpcomingSales={scrollToUpcomingSales} />
      <Carousel/>
      <FundList/>
      <UpcomingSales ref={upcomingSalesRef}/>
      <OurPartner/>
    </div>
  );
}

export default Home;
