
import React,{useState} from "react";
import person1 from "../../../assets/images/carousel/person1.png";
import { useNavigate } from 'react-router-dom';
import l3 from '../../../assets/images/carousel/l3.png'
import { TbFilterCheck } from "react-icons/tb";
import { PiArrowsDownUpBold } from "react-icons/pi";

const salesData = [
  {
    heading: 'PUPPO',
    subheading: 'FAIR LAUNNCH-MAX BUY 5 SOL',
    chartData: {
      datasets: [
        {
          data: [70, 30],
          backgroundColor: ['#FF6384', 'transparent'],
          borderWidth: 0,
        },
      ],
    },
    progress: 10.1,
    raised: 30,
    details: {
      type: 'SOFT',
      amount: '100 SOL',
      liquidity: '51%',
      lockTime: '365 DAYS',
      saleStartsIn: '00:29:23:00',
    },
  },
  {
    heading: 'SUNNY',
    subheading: 'FAIR LAUNNCH-MAX BUY 5 SOL',
    chartData: {
      datasets: [
        {
          data: [60, 40],
          backgroundColor: ['#FF9F40', 'transparent'],
          borderWidth: 0,
        },
      ],
    },
    progress: 10.1,
    raised: 30,
    details: {
      type: 'HARD',
      amount: '200 ETH',
      liquidity: '51%',
      lockTime: '365 DAYS',
      saleStartsIn: '00:29:23:00',
    },
  },
  {
    heading: 'STARLIGHT',
    subheading: 'FAIR LAUNNCH-MAX BUY 5 SOL',
    chartData: {
      datasets: [
        {
          data: [80, 20],
          backgroundColor: ['#9966FF', 'transparent'],
          borderWidth: 0,
        },
      ],
    },
    progress: 10.1,
    raised: 30,
    details: {
      type: 'FLEXIBLE',
      amount: '0.35 BTC',
      liquidity: '51%',
      lockTime: '365 DAYS',
      saleStartsIn: '00:29:23:00',
    },
  },
  {
    heading: 'PUPPO',
    subheading: 'FAIR LAUNNCH-MAX BUY 5 SOL',
    chartData: {
      datasets: [
        {
          data: [70, 30],
          backgroundColor: ['#FF6384', 'transparent'],
          borderWidth: 0,
        },
      ],
    },
    progress: 10.1,
    raised: 30,
    details: {
      type: 'SOFT',
      amount: '100 SOL',
      liquidity: '51%',
      lockTime: '365 DAYS',
      saleStartsIn: '00:29:23:00',
    },
  },
  {
    heading: 'SUNNY',
    subheading: 'FAIR LAUNNCH-MAX BUY 5 SOL',
    chartData: {
      datasets: [
        {
          data: [60, 40],
          backgroundColor: ['#FF9F40', 'transparent'],
          borderWidth: 0,
        },
      ],
    },
    progress: 10.1,
    raised: 30,
    details: {
      type: 'HARD',
      amount: '200 ETH',
      liquidity: '51%',
      lockTime: '365 DAYS',
      saleStartsIn: '00:29:23:00',
    },
  },
  {
    heading: 'STARLIGHT',
    subheading: 'FAIR LAUNNCH-MAX BUY 5 SOL',
    chartData: {
      datasets: [
        {
          data: [80, 20],
          backgroundColor: ['#9966FF', 'transparent'],
          borderWidth: 0,
        },
      ],
    },
    progress: 10.1,
    raised: 30,
    details: {
      type: 'FLEXIBLE',
      amount: '0.35 BTC',
      liquidity: '51%',
      lockTime: '365 DAYS',
      saleStartsIn: '00:29:23:00',
    },
  },
  
];

const ProjectLists = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const navigate = useNavigate();

  // Handle navigation to the projects page
 

  const handleViewMoreClick2 = () => {
    navigate('/project');
  };
  

  return (
    <div  className="upcoming-sales  h-full   md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]">
        <div className="bg-black text-white px-4 xxs1:px-16 ">
      {/* Heading */}
      <h1 className="text-[40px] font-posterama font-bold">PROJECTS</h1>

      {/* Tabs */}
      <div className="flex space-x-8 ss2:space-x-12 my-8">
        <button
          className={`cursor-pointer relative ${
                      selectedTab === "all"
                        ? "before:absolute before:left-0 before:right-0 before:top-7 before:h-[2px] before:bg-gradient-to-r before:from-[#F3B3A7] before:to-[#CACCF5] before:rounded text-transparent bg-clip-text bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]"
                        : ""
                    }`}
          onClick={() => setSelectedTab("all")}
        >
          ALL
        </button>
        <button
          className={`cursor-pointer relative ${
                      selectedTab === "advanced"
                        ? "before:absolute before:left-0 before:right-0 before:top-7 before:h-[2px] before:bg-gradient-to-r before:from-[#F3B3A7] before:to-[#CACCF5] before:rounded text-transparent bg-clip-text bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]"
                        : ""
                    }`}
          onClick={() => setSelectedTab("advanced")}
        >
          ADVANCED
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex  flex-col md:flex-row items-center  justify-center space-x-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-[#444444] text-white p-2 rounded-xl outline-none placeholder-gray-500"
        />
        
        <div className="flex pr-2 gap-5 md:gap-2 md:mt-0 mt-4 w-full md:w-[30%] items-center  justify-center">
        {/* Filter and Sort Buttons */}
        <button className="bg-[#444444] ml-[-2%]  p-2  rounded-lg text-white flex items-center w-full">
        <TbFilterCheck/>
          <span className="md:ml-2">Filter</span>
          
        </button>
        
        <button className="bg-[#444444] p-2 rounded-lg text-white flex items-center w-full">
        <PiArrowsDownUpBold/>
          <span className="ml-2">Sort</span>
          
        </button>
        </div>
      </div>
    </div>

    <div className="flex lg:flex-row flex-col flex-wrap items-center w-[95%] m-auto  justify-around">
      
      {salesData.map((sale, index) => (
        <div
          key={index}
          onClick={handleViewMoreClick2} 
          className="bg-[#FFFFFF1A] cursor-pointer text-white p-1 rounded-xl flex flex-col  ss2:w-[325px]  xxs1:w-[400px]  mt-14"
        >
          <div className="h-[280px]  rounded-lg py-5 flex flex-col">
            <div className="relative">
              <img
                src={person1}
                className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[50%] rounded-full h-[100px] md:min-h-[114px]"
                alt={sale.heading}
              />
               <div className="absolute top-[20px] right-[60px] ss2:right-[100px] xxs1:right-[130px] w-10 h-10  rounded-full border-1 border-gray-300">
                <img src={l3} alt="small" className="object-cover w-full h-full" />
              </div>
            </div>

            <div className="mt-[70px] text-center text-white space-y-5">
              <div className="text-[24px] font-semibold">{sale.heading}</div>
              <div className="text-[16px] text-[#FFFFFFA6] font-medium">{sale.subheading}</div>
              <div className="text-[#FFC145] text-[18px] font-normal">
                UPCOMING
              </div>
            </div>

            <div className="bg-[#FFFFFF66] h-[2px] w-[92%] mx-auto mt-6"></div>
          </div>

          <div className="flex">
            <div className="relative flex items-center overflow-hidden w-[60%] h-72">
              <div className="absolute left-[-110%]  ss2:left-[-62%]  xxs1:left-[-30%] sm:left-[-20%] md:left-[-45%] top-0 w-72 h-72">
                <svg className="transform rotate-90" viewBox="0 0 36 36">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: "#f3b3a7", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#cac9f5", stopOpacity: 1 }} />

                    </linearGradient>
                  </defs>
                  <path
                    className="text-gray-800"
                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.8"
                  />
                  <path
                    className="text-purple-400"
                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3.8"

                    strokeDasharray={`${sale.progress * 4}, 100`}

                  />
                </svg>
                <div className="absolute ml-28 ss2:ml-10 inset-0 flex flex-col items-center justify-center">
                  <span>Progress</span>
                  <span className="text-lg font-semibold text-white">

                    ({sale.progress}%)
                  </span>
                  <span className="text-sm text-gray-400 mt-1">
                    {sale.raised} SOL RAISED

                  </span>
                </div>
              </div>
            </div>


            <div className="mt-6 w-[40%] flex flex-col justify-around">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">{sale.details.type}</span>
                <span className="text-lg font-semibold bg-gradient-to-r from-[#f09787]  to-[#CACCF5] text-transparent bg-clip-text">{sale.details.amount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Liquidity</span>
                <span className="text-lg font-semibold">{sale.details.liquidity}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Lock Time</span>
                <span className="text-lg font-semibold">{sale.details.lockTime}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Sale Starts In</span>
                <span className="text-lg font-semibold">{sale.details.saleStartsIn}</span>
              </div>
              <button onClick={handleViewMoreClick2}  className="border-b-2 border-r-gray-600 w-20 cursor-pointer">
                View More
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default ProjectLists;

