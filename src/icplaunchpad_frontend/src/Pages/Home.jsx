import React from 'react';
import OurPartner from '../components/HomePageComponent/OurPartners';
import FundList from '../components/HomePageComponent/FundList';
import Carousel from '../components/HomePageComponent/Carousel';
import Hero from '../components/HomePageComponent/Hero';
import UpcomingSales from '../components/HomePageComponent/UpcomingSales';

function Home() {
  return (
    <div>
      <Hero/>
      <Carousel/>
      <FundList/>
      <UpcomingSales/>
      <OurPartner/>
    </div>
  );
}

export default Home;
