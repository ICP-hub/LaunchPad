import React from 'react';
import OurPartner from '../components/HomePageComponent/OurPartners';
import FundList from '../components/HomePageComponent/FundList';
import Carousel from '../components/HomePageComponent/Carousel';

function Home() {
  return (
    <div>
      <Carousel/>
      <FundList/>
      <OurPartner/>
    </div>
  );
}

export default Home;
