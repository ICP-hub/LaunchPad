import React from 'react';
import person1 from "../../../assets/images/carousel/person1.png";

const PreviousSaleTab = () => {
  
  const sales = [
    {
      name: 'PUPPO',
      description: 'FAIR LAUNCH - MAX BUY 5 SOL',
      image: 'person1', // Replace this with the actual image URL
    },
    {
      name: 'PUPPO',
      description: 'FAIR LAUNCH - MAX BUY 5 SOL',
      image: 'https://via.placeholder.com/50', // Replace this with the actual image URL
    },
  ];

  return (
    <div className="max-w-3xl mx-auto  font-posterama p-4 rounded-lg">
      {sales.map((sale, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 mb-4 bg-[#222222] rounded-2xl"
        >
          {/* Sale Info */}
          <div className="flex items-center">
            <img
              src={person1}
              alt={sales.image}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="text-lg text-white">{sale.name}</h3>
              <p className="text-sm text-gray-400">{sale.description}</p>
            </div>
          </div>

          {/* View Button */}
          <button className="text-white text-sm border-b-2  px-1 mr-6  hover:bg-gray-600">
            VIEW
          </button>
        </div>
      ))}
    </div>
  );
};

export default PreviousSaleTab;
