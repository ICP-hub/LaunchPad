import React, { useState, useEffect } from 'react';
import GradientText from '../../common/GradientText';

import Activities from './Activities/Activities';
import Affiliate from './Affiliate/Affiliate';
import Favorited from './Favorited/Favorited';
import RecentlyViewed from './RecentlyViewed/RecentlyViewed';
import MyContribution from './MyContribution/MyContribution';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Activities");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "Activities":
        return <Activities />;
      case "Affiliate":
        return <Affiliate />;
      case "Favorited":
        return <Favorited />;
      case "Recently Viewed":
        return <RecentlyViewed />;
      case "My Contribution":
        return <MyContribution />;
      default:
        return <Activities />;
    }
  };

  const tabNames = [
    "Activities",
    "Affiliate",
    "Favorited",
    "Recently Viewed",
    "My Contribution",
  ];

  return (
    <div>
      {/* Desktop View */}
      {!isMobile && (
        <>
        <div className="bg-black text-white font-posterama p-8 max-w-[1170px] mx-auto">
          {/* Header Section */}
          <div className="flex flex-col items-start bg-[#FFFFFF1A] p-8 pl-[100px] rounded-2xl gap-12 mb-6">
            <p className="text-[19px] font-inter">
              Connect as kjgr451gv7ogj9cgg8g ik 9i6v68u8u
            </p>
            <div className="flex space-x-6">
              <button className="bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-black py-2 px-4 rounded-2xl">
                Share Your Profile
              </button>
              <button className="bg-transparent border border-gray-500 py-2 px-4 w-[200px] rounded-2xl">
                <GradientText>LOGOUT</GradientText>
              </button>
            </div>
          </div>

          {/* Body Section */}
          <div className="bg-[#FFFFFF1A] p-6 rounded-2xl">
            <div className="max-w-[90%] mx-auto mt-6">
              <div className="flex ml-28 max-w-[80%] gap-6 dlg:gap-11 text-[14px] dlg:text-[15px] font-posterama">
                {tabNames.map((tab) => (
                  <div
                    key={tab}
                    className={`cursor-pointer relative ${
                      activeTab === tab
                        ? "before:absolute before:left-0 before:right-0 before:top-7 before:h-[2px] before:bg-gradient-to-r before:from-[#F3B3A7] before:to-[#CACCF5] before:rounded"
                        : ""
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </div>
                ))}
              </div>
              <div className="mt-5">{renderContent()}</div>
            </div>
          </div>
          </div>
        </>
      )}

      {/* Mobile View */}
      {isMobile && (
  <>
  <div className="bg-black text-white font-posterama p-8 max-w-[1170px] mx-auto">
    {/* Header Section */}
    <div  className='mx-[-30px]'>
    <div className="flex flex-col min-h-[100px] items-start bg-[#111] p-4 mb-4  w-full">
      <p className="text-[14px] text-[#A5A5A5] font-inter">Connect as  </p>
      <p className=' text-[14px] font-500'>kjgr451gv7ogj9cgg8g ik 9i6v68u8u</p>
    </div>
</div>
    {/* Share Profile Button */}
    <div className='mx-8'>
    <button className="bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-black py-2 px-4 rounded-2xl w-full  text-center mb-4">
      SHARE YOUR PROFILE
    </button>
    </div>
    {/* Dropdown for Activities */}
   

    {/* Stats Section */}
    <div className="p-4 bg-[#1F1F1F] rounded-2xl mb-6">
     {/* Dropdown for Tabs */}
     <div className="relative w-full bg-black p-2 mb-4">
            <select
              className="w-full bg-transparent text-white text-left py-2 px-3"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              {tabNames.map((tab) => (
                <option key={tab} value={tab} className="bg-black text-white">
                  {tab}
                </option>
              ))}
            </select>
          </div>

          {/* Render the selected content */}
          <div className="p-4 bg-[#1F1F1F] rounded-2xl">
            {renderContent()}
          </div>
      
    </div>
  

    {/* Logout Button */}
    <div className='flex justify-center items-center'>
    <button className="w-[70%] bg-transparent border  border-[#CACCF5] py-2 px-4 rounded-2xl text-white">
      LOGOUT
    </button>
    </div>
    </div>
  </>
)}

    </div>
  );
};

export default Profile;
