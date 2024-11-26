import React from 'react';

import Clients from '../components/LaunchACoin/Clients';
import FundedProjects from '../components/LaunchACoin/FundedProjects';
import CommunityStats from '../components/LaunchACoin/CommunityStats';
import WhyLaunch from '../components/LaunchACoin/WhyLaunch';
import Launch from '../components/LaunchACoin/Launch';

function Home() {
  return (
    <div>
      <Launch/>
      <WhyLaunch/>
      <CommunityStats/>
      {/* <FundedProjects/> */}
      <Clients/>
    </div>
  );
}

export default Home;
