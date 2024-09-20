import React from 'react';

const ProfileCard = () => {
  return (
    <div className="bg-gray-800 w-64 p-4 rounded-lg shadow-lg relative text-white">
      {/* Close button */}
      <button className="absolute top-2 right-2 text-gray-400 hover:text-white focus:outline-none">
        ✕
      </button>
      {/* Profile Picture */}
      <div className="flex items-center justify-center">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="w-20 h-20 rounded-full border-2 border-gray-600"
        />
      </div>
      {/* Profile Info */}
      <div className="text-center mt-4">
        <h2 className="text-lg font-semibold">ABCD</h2>
        <p className="text-sm text-gray-400">fghyrf26rg895</p>
        <button className="bg-gray-700 text-xs py-1 px-4 mt-2 rounded-full hover:bg-gray-600 transition">
          Block Explorer
        </button>
      </div>
      {/* ICP and Activity Sections */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">ICP</span>
          {/* You can add content here */}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">ACTIVITY</span>
          {/* You can add content here */}
        </div>
      </div>
      {/* Disconnect Button */}
      <button className="w-full bg-gray-600 text-gray-400 py-2 mt-4 rounded-lg cursor-not-allowed" disabled>
        DISCONNECT
      </button>
    </div>
  );
};

export default ProfileCard;
