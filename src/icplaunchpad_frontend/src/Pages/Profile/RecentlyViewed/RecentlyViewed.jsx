import React from 'react';
import person1 from "../../../../assets/images/carousel/user.png";

const RecentlyViewed = () => {
  
  const sales = [
    {
      name: 'PUPPO',
      description: 'FAIR LAUNCH - MAX BUY 5 SOL',
      
    },
    {
      name: 'PUPPO',
      description: 'FAIR LAUNCH - MAX BUY 5 SOL',
      
    },
  ];

  return (
    <div className="max-w-3xl mx-auto  font-posterama p-1 ss2:p-4 rounded-lg">
      {sales.map((sale, index) => (
        <div
          key={index}
          className="flex xxs1:items-center justify-between  p-1 mb-4 bg-[#222222] rounded-2xl"
        >
          {/* Sale Info */}
          <div className="flex  items-center">
            <img
              src={person1}
              alt={sale.name}
              className="w-12 h-12 mr-1 rounded-full object-cover xxs1:mr-4"
            />
            <div>
              <h3 className="text-lg text-white">{sale.name}</h3>
              <p className="text-sm text-gray-400">{sale.description}</p>
            </div>
          </div>

          {/* View Button */}
          <button className="hidden xxs1:block text-[15px] border-b-2  px-1 mr-6  hover:bg-gray-600">
            VIEW Again
          </button>
        </div>
      ))}
    </div>
  );
};

export default RecentlyViewed;
