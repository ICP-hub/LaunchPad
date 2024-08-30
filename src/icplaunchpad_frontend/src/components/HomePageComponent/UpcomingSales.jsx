import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import person1 from '../../assets/images/carousel/person1.png';
import l3 from '../../assets/images/carousel/l3.png';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const UpcomingSales = () => {
  const navigate = useNavigate();

  // Handle navigation to the projects page
  const handleViewMoreClick = () => {
    navigate('/projects');
  };

  // Array of objects containing data for each card
  const salesData = [
    {
      heading: 'PUPPO',
      subheading: 'Subheading 1',
      chartData: {
        datasets: [
          {
            data: [70, 30], // Example data for PUPPO (70% visible)
            backgroundColor: ['#FF6384', 'transparent'], // Only 70% is visible
            borderWidth: 0, // Remove the border around the chart
          },
        ],
      },
      progressText: 'PROGRESS (10.10%) 30 SOL RAISED',
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
      subheading: 'EXCITING NEW PROJECT - LIMITED TO 10 ETH',
      chartData: {
        datasets: [
          {
            data: [60, 40], // Example data for SUNNY (60% visible)
            backgroundColor: ['#FF9F40', 'transparent'],
            borderWidth: 0,
          },
        ],
      },
      progressText: 'PROGRESS (15.00%) 45 SOL RAISED',
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
      subheading: 'INNOVATIVE TOKEN SALE - MAX PURCHASE 0.5 BTC',
      chartData: {
        datasets: [
          {
            data: [80, 20], // Example data for STARLIGHT (80% visible)
            backgroundColor: ['#9966FF', 'transparent'],
            borderWidth: 0,
          },
        ],
      },
      progressText: 'PROGRESS (20.00%) 50 SOL RAISED',
      details: {
        type: 'FLEXIBLE',
        amount: '0.35 BTC',
        liquidity: '51%',
        lockTime: '365 DAYS',
        saleStartsIn: '00:29:23:00',
      },
    },
  ];

  return (
    <div className="upcoming-sales h-full  md:mb-[80%] lg:mb-0 sm4:mb-3 py-[5%] px-[9%]">
      <div className="flex justify-between items-center ">
        <h2 className="text-white text-2xl">UPCOMING SALES</h2>
        <button onClick={handleViewMoreClick} className="text-white underline">
          View More
        </button>
      </div>

      <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-11  lg:gap-4 h-[580px]  pt-[20%] md:pt-[15%] 
         mb-[410%] xxs:mb-[330%] sm2:mb-[270%] sm1:mb-[280%] sm3:mb-[280%] sm:mb-[280%] md:mb-0 dxl:pt-[10%]">
        {salesData.map((sale, index) => (
          <div key={index} className="bg-[#222222] rounded-2xl  py-6 pr-6 w-full relative mt-[20%] sm1:mt-[13%] md:mt-6">
            <div className="absolute -top-[13%] left-1/2 transform -translate-x-1/2">
              <img
                src={person1}
                alt="sale-item"
                className="rounded-full w-[115px] object-cover"
              />
              <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full border-1 border-gray-300">
                <img src={l3} alt="small" className="object-cover w-full h-full" />
              </div>
            </div>
            <div className="mt-14 text-center">
              <h3 className="text-white lg:text-lg">{sale.heading}</h3>
              <p className="text-gray-400">{sale.subheading}</p>
              <p className="text-yellow-500 mt-2">UPCOMING</p>
              <hr className="my-4 border-gray-600" />
              <div className="flex items-center relative">
                <div className="w-1/2 relative overflow-hidden">
                  <div className="relative" style={{ width: '140%', transform: 'translateX(-40%)' }}>
                    <Doughnut
                      data={sale.chartData}
                      options={{
                        cutout: '80%',
                        plugins: {
                          legend: {
                            display: false, // Hide the legend
                          },
                          tooltip: {
                            enabled: false, // Disable tooltips
                          },
                        },
                      }}
                    />
                    <div className="absolute left-[22%] inset-0 flex items-center justify-center text-white 
                    text-[7px] md:text-[8px] lg1:text-[12px] text-center">
                      <div>
                        <p>PROGRESS (10.10%)</p>
                        <p>30 SOL RAISED</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 text-white pl-4">
                  <p>{sale.details.type}</p>
                  <p>{sale.details.amount}</p>
                  <p>LIQUIDITY</p>
                  <p>{sale.details.liquidity}</p>
                  <p>LOCK TIME</p>
                  <p>{sale.details.lockTime}</p>
                  <p className="mt-2">SALE STARTS IN</p>
                  <p>{sale.details.saleStartsIn}</p>
                  <button
                    onClick={handleViewMoreClick}
                    className="text-blue-500 underline mt-2"
                  >
                    View More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingSales;
