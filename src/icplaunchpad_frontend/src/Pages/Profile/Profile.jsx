// import React, { useState, useEffect } from 'react';
// import GradientText from '../../common/GradientText';


// import Activities from './Activities/Activities';
// import Affiliate from './Affiliate/Affiliate';
// import Favorited from './Favorited/Favorited';
// import RecentlyViewed from './RecentlyViewed/RecentlyViewed';
// import MyContribution from './MyContribution/MyContribution';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../StateManagement/useContext/useClient';

// const Profile = () => {
//   const [activeTab, setActiveTab] = useState("Activities");
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const { logout,isAuthenticated, principal } = useAuth();
//  const navigate = useNavigate();

//   // const handleLogout = async (e) => {
//   //   e.preventDefault();
//   //     await logout().then(() => window.location.reload()); 
  
//   // };
//   const handleLogout = async () => {
//     try {
//       console.log("Logging out...");
//       await logout();

//       window.location.href = "/";
//       console.log("Logged out successfully. Redirecting...");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [principal]);

//   const renderContent = () => {
//     switch (activeTab) {
//       case "Activities":
//         return <Activities />;
//       // case "Affiliate":
//       //   return <Affiliate />;
//       // case "Favorited":
//       //   return <Favorited />;
//       // case "Recently Viewed":
//       //   return <RecentlyViewed />;
//       case "My Contribution":
//         return <MyContribution />;
//       default:
//         return <Activities />;
//     }
//   };

//   const tabNames = [
//     "Activities",
//     // "Affiliate",
//     // "Favorited",
//     // "Recently Viewed",
//     "My Contribution",
//   ];

//   return (
//     <div>
//       {/* Desktop View */}
//       {!isMobile && (
//         <>
//           <div className="bg-black text-white  p-8 max-w-[1170px] mx-auto">
//             {/* Header Section */}
//             <div className="flex flex-col items-start bg-[#FFFFFF1A] p-8  pl-[100px] rounded-2xl gap-12 mb-6">
//               <p className="text-[19px] font-inter">
//                 Connect as {principal ? principal.toText() : "No principal found"}
//               </p>
//               <div className="flex space-x-6">
//                 <button className="bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] font-semibold text-black py-2 px-4 rounded-2xl">
//                   Share Your Profile
//                 </button>
//                 <button
//                   onClick={handleLogout} 
//                   disabled={!isAuthenticated}
//                   className="bg-transparent border border-gray-500 py-2 px-4 w-[200px] rounded-2xl cursor-pointer"
//                 >
//                   <GradientText>LOGOUT</GradientText>
//                 </button>
//               </div>
//             </div>

//             {/* Body Section */}
//             <div className="bg-[#FFFFFF1A] p-6 rounded-2xl">
//               <div className="max-w-[90%] mx-auto mt-6">
//                 <div className="flex ml-28 max-w-[80%] gap-8 dlg:gap-11 text-[11px] lg:text-[14px] font-posterama">
//                   {tabNames.map((tab) => (
//                     <div
//                     key={tab}
//                     className={`cursor-pointer relative ${
//                       activeTab === tab
//                         ? "before:absolute before:left-0 before:right-0 before:top-7 before:h-[2px] before:bg-gradient-to-r before:from-[#F3B3A7] before:to-[#CACCF5] before:rounded text-transparent bg-clip-text bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]"
//                         : ""
//                     }`}
//                     onClick={() => setActiveTab(tab)}
//                   >
//                     {tab}
//                   </div>
                  
//                   ))}
//                 </div>
//                 <div className="mt-5">{renderContent()}</div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

     
// {/* Mobile View */}
// {isMobile && (
//   <>
//     <div className="bg-black text-white p-2 max-w-[1170px] mx-auto">
//       {/* Header Section */}
//       <div className="mx-[-30px]">
//         <div className="flex flex-col min-h-[100px] items-start bg-[#111] p-4 mx-4 mb-4 w-full">
//           <p className="text-[14px] text-[#A5A5A5] font-inter">Connect as</p>
//                 <p className="text-[14px] font-500">{principal ? principal.toText() : "No principal found"}</p>
//         </div>
//       </div>

//       {/* Share Profile Button */}
//       <div className="md:mx-8 justify-center items-center">
//         <button className="bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-black py-2 px-4 rounded-2xl w-full xxs1:w-1/2 text-center mb-4">
//           SHARE YOUR PROFILE
//         </button>
//       </div>

//       {/* Dropdown Section */}
//       <div className="p-2 bg-[#1F1F1F] rounded-2xl mb-6">
//         <div className="relative w-full ss2:w-1/2 bg-black font-posterama p-2 mb-4">
//           {/* Container for the underline effect */}
//           <div className={`relative ${activeTab ? 'after:absolute after:left-0 after:right-0 after:bottom-[-2px] after:h-[2px] after:bg-gradient-to-r after:from-[#F3B3A7] after:to-[#CACCF5] after:rounded' : ''}`}>
//             <select
//               className={`w-full bg-transparent text-left ss2:py-2 ss2:px-3 p-1
//               ${activeTab ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]' : 'text-white'}`}
//               value={activeTab}
//               onChange={(e) => setActiveTab(e.target.value)}
//             >
//               {tabNames.map((tab) => (
//                 <option
//                   key={tab}
//                   value={tab}
//                   className={`bg-black text-white text-[14px] ${activeTab === tab ? 'text-[10px] text-transparent ' : ''}`}
//                 >
//                   {tab}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Render the selected content */}
//         <div className="p-4 bg-[#1F1F1F] rounded-2xl">
//           {renderContent()}
//         </div>
//       </div>

//       {/* Logout Button */}
//       <div className="flex justify-center items-center">
//         <button
//           onClick={handleLogout}
//           disabled={!isAuthenticated}
//           className="w-[70%] bg-transparent border border-[#CACCF5] py-2 px-4 rounded-2xl text-white"
//         >
//           LOGOUT
//         </button>
//       </div>
//     </div>
//   </>
// )}

//     </div>
//   );
// };

// export default Profile;



import React, { useState, useEffect } from 'react';
import GradientText from '../../common/GradientText';


import Activities from './Activities/Activities';
import Affiliate from './Affiliate/Affiliate';
import Favorited from './Favorited/Favorited';
import RecentlyViewed from './RecentlyViewed/RecentlyViewed';
import MyContribution from './MyContribution/MyContribution';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../StateManagement/useContext/useClient';
import { useSelector } from 'react-redux';
import CopyToClipboard from '../../common/CopyToClipboard';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Activities");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { logout } = useAuth();
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const principal = useSelector((currState) => currState.internet.principal);
  const navigate = useNavigate();

  // const handleLogout = async (e) => {
  //   e.preventDefault();
  //     await logout().then(() => window.location.reload()); 

  // };
  const handleLogout = async (e) => {
    e.preventDefault();
    await logout().then(() => {
      navigate("/");
      window.location.reload();
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [principal]);

  const renderContent = () => {
    switch (activeTab) {
      case "Activities":
        return <Activities />;
      // case "Affiliate":
      //   return <Affiliate />;
      // case "Favorited":
      //   return <Favorited />;
      // case "Recently Viewed":
      //   return <RecentlyViewed />;
      case "My Contribution":
        return <MyContribution />;
      default:
        return <Activities />;
    }
  };

  const tabNames = [
    "Activities",
    // "Affiliate",
    // "Favorited",
    // "Recently Viewed",
    "My Contribution",
  ];

  return (
    <div>
      {/* Desktop View */}
      {!isMobile && (
        <>
          <div className="bg-black text-white  p-8 max-w-[1170px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col items-start  bg-[#FFFFFF1A] p-8  pl-[100px] rounded-2xl gap-12 mb-6">
          
             <p className="text-[19px] font-inter text-nowrap w-full">
                Connect as <span className='text-[16px]'> <CopyToClipboard address={principal}  width={'90%'} /> </span>
              </p>
             
              <div className="flex space-x-6">
                <button className="bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] font-semibold text-black py-2 px-4 rounded-2xl">
                  Share Your Profile
                </button>
                <button
                  onClick={handleLogout}
                  disabled={!isAuthenticated}
                  className="bg-transparent border border-gray-500 py-2 px-4 w-[200px] rounded-2xl"
                >
                  <GradientText>LOGOUT</GradientText>
                </button>
              </div>
            </div>

            {/* Body Section */}
            <div className="bg-[#FFFFFF1A] p-6 rounded-2xl">
              <div className="max-w-[90%] mx-auto mt-6">
                <div className="flex ml-28 max-w-[80%] gap-8 dlg:gap-11 text-[11px] lg:text-[14px] font-posterama">
                  {tabNames.map((tab) => (
                    <div
                      key={tab}
                      className={`cursor-pointer relative ${activeTab === tab
                          ? "before:absolute before:left-0 before:right-0 before:top-7 before:h-[2px] before:bg-gradient-to-r before:from-[#F3B3A7] before:to-[#CACCF5] before:rounded text-transparent bg-clip-text bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]"
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
          <div className="bg-black text-white p-2 max-w-[1170px] mx-auto">
            {/* Header Section */}
            <div className="mx-[-30px]">
              <div className="flex flex-col text-sm min-h-[100px] items-start bg-[#111] p-4 px-10  mb-4 w-full">
                <p className="text-[14px] mb-2 text-[#A5A5A5] font-inter">Connect as</p>
                <CopyToClipboard address={principal} />
              </div>
            </div>

            {/* Share Profile Button */}
            <div className="md:mx-8 justify-center items-center">
              <button className="bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] text-black py-2 px-4 rounded-2xl w-full xxs1:w-1/2 text-center mb-4">
                SHARE YOUR PROFILE
              </button>
            </div>

            {/* Dropdown Section */}
            <div className="p-2 bg-[#1F1F1F] rounded-2xl mb-6">
              <div className="relative w-full ss2:w-1/2 bg-black font-posterama p-2 mb-4">
                {/* Container for the underline effect */}
                <div className={`relative ${activeTab ? 'after:absolute after:left-0 after:right-0 after:bottom-[-2px] after:h-[2px] after:bg-gradient-to-r after:from-[#F3B3A7] after:to-[#CACCF5] after:rounded' : ''}`}>
                  <select
                    className={`w-full bg-transparent text-left ss2:py-2 ss2:px-3 p-1
              ${activeTab ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]' : 'text-white'}`}
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                  >
                    {tabNames.map((tab) => (
                      <option
                        key={tab}
                        value={tab}
                        className={`bg-black text-white text-[14px] ${activeTab === tab ? 'text-[10px] text-transparent ' : ''}`}
                      >
                        {tab}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Render the selected content */}
              <div className="p-4 bg-[#1F1F1F] rounded-2xl">
                {renderContent()}
              </div>
            </div>

            {/* Logout Button */}
            <div className="flex justify-center items-center">
              <button
                onClick={handleLogout}
                disabled={!isAuthenticated}
                className="w-[70%] bg-transparent border border-[#CACCF5] py-2 px-4 rounded-2xl text-white"
              >
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