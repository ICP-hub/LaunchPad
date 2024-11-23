import React from 'react';
import l3 from '../../../assets/images/carousel/l3.png';
import l1 from '../../../assets/images/partner.png'
import p2 from '../../../assets/images/projectsIcon/p2.png';

const FundedProjects = () => {
  return (
    <div className="container mx-auto px-[7%] lg:px-[9%] py-8 ">
      <div className="text-left">
        <h2 className="text-3xl font-bold font-posterama mb-8">FUNDED PROJECTS</h2>
        <p className="text-[#FFFFFF99] mb-8">
          We introduce innovative technologies to our community.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 font-posterama gap-16 md:gap-12 pt-[5%]">
           <div  className="relative px-8  pb-40 h-[180px]  rounded-2xl bg-[#333333]">
            <div className="absolute  -top-[25%] left-1/2  transform -translate-x-1/2">
              <img src={l1} alt="xy" className="object-cover w-[100px]  " draggable="false" />
            </div>
            <p className="text-center text-[18px] ss2:text-[20px] font-semibold mt-[60px]">FUNDED PROJECTS</p>
            <p className="text-center text-xl sm1:text-[25px] py-4 ">113</p>
          </div>
           
          <div  className="relative px-8  pb-40 h-[180px]  rounded-2xl bg-[#333333]">
            <div className="absolute  -top-[25%] left-1/2  transform -translate-x-1/2">
              <img src={p2} alt="xy" className="object-cover w-[100px]  "  draggable="false"/>
            </div>
            <p className="text-center text-[18px] ss2:text-[20px] font-semibold mt-[60px]">UNIQUE PARTICIPANTS</p>
            <p className="text-center text-xl sm1:text-[25px] py-4">30,294</p>
          </div>

         <div  className="relative px-8  pb-40 h-[180px]  rounded-2xl bg-[#333333]">
            <div className="absolute  -top-[25%] left-1/2  transform -translate-x-1/2">
              <img src={l3} alt="xy" className="object-cover w-[100px]  "  draggable="false"/>
            </div>
            <p className="text-center text-[18px] ss2:text-[20px] font-semibold mt-[60px]">RAISED CAPITAL</p>
            <p className="text-center text-xl sm1:text-[25px] py-4 ">$41,582,502.04</p>
          </div>

      </div>
    </div>
  );
};

export default FundedProjects;
