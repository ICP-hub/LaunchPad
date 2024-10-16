import React,{useState} from "react";
import person1 from "../../../../assets/images/carousel/person1.png";
import { useNavigate } from 'react-router-dom';
import l3 from '../../../../assets/images/carousel/l3.png'


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
];

const ProjectLists = () => {
  const navigate = useNavigate();

  // Handle navigation to the projects page
  const handleViewMoreClick2 = () => {
    navigate('/project');
  };
  

  return (
    <div  className="    md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]">
    <div className="flex lg:flex-row flex-col gap-6 items-center w-[95%]  m-auto justify-around">
      
      {salesData.map((sale, index) => (
        <div
          key={index}
          className=" text-white p-1 rounded-lg flex flex-col w-[250px] ss2:w-[305px] xxs:w-[375px] xxs1:w-[400px] mt-14"
        >
          <div className="h-[280px] rounded-lg py-5 font-posterama flex flex-col">
            <div className="relative">
              <img
                src={person1}
                className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[50%] rounded-full h-[100px] md:min-h-[114px]"
                alt={sale.heading}
              />
               <div className="absolute top-[20px] right-[80px] xxs:right-[130px] w-10 h-10  rounded-full border-1 border-gray-300">
                <img src={l3} alt="small" className="object-cover w-full h-full" />
              </div>
            </div>

            <div className="mt-[70px] text-center text-white space-y-5">
              <div className="text-[24px] font-bold">{sale.heading}</div>
              <div className="text-[16px] font-medium">{sale.subheading}</div>
              <div className="text-[#FFC145] text-[18px] font-semibold">
                UPCOMING
              </div>
            </div>

            <div className="bg-[#FFFFFF66] h-[2px] w-[92%] mx-auto mt-6"></div>
          </div>

          <div className="flex items-center justify-center ">
            <div className="relative flex items-center overflow-hidden w-[60%] h-72">
              <div className="absolute  left-[-100%]  ss2:left-[-70%]  xxs:left-[-40%] sm:left-[-45%]  top-0 w-72 h-72">
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
                <div className="absolute ml-28 xxs1:ml-10 inset-0 flex flex-col items-center justify-center">
                  <span>Progress</span>
                  <span className=" text-[12px] ss2:text-lg font-semibold text-white">
                    ({sale.progress}%)
                  </span>
                  <span className=" text-[10px] ss2:text-sm text-gray-400 mt-1">
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
