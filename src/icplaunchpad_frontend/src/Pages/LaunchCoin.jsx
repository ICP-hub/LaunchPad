import React from 'react';
import OurPartner from '../components/HomePageComponent/OurPartners';
import FundList from '../components/HomePageComponent/FundList';
import Carousel from '../components/HomePageComponent/Carousel';
import UpcomingSales from '../components/HomePageComponent/UpcomingSales';

function Home() {
  return (
    <div>
      <Carousel/>
      <FundList/>
      <UpcomingSales/>
      <OurPartner/>
    </div>
  );
}

export default Home;
