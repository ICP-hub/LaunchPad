import React, { useState, useEffect } from "react";
import ProjectRectangleBg from "../../../assets/images/project-rectangle-bg.png";

import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { IoGlobeOutline } from "react-icons/io5";
import { FaReddit } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";

import person1 from "../../../assets/images/carousel/person1.png"
import ProjectTokenAbout from "./about/ProjectTokenAbout";
import FAQsDiscussion from "./FAQsDiscussion/FaqDiscussionTab.jsx";
import Pooolinfo from "./pooolinfo/Pooolinfo";
import Token from "./token/Token";
import PreviousSale from "./PreviousSale/PreviousSale.jsx";
import MobileViewTab from "./MobileViewTab";
import { FiEdit3 } from "react-icons/fi";

import AddToWhitelist from "../../components/Modals/AddToWhitelist.jsx";
import { useAuth } from "../../auth/useAuthClient.jsx";
import { Principal } from '@dfinity/principal';
import { useLocation } from 'react-router-dom';

const TokenPage = () => {
  const [activeTab, setActiveTab] = useState("About");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [sellType, setSellType] = useState('public');
  const [modalIsOpen, setIsOpen] = useState(false);
  const { createCustomActor, isAuthenticated, userPrincipal } = useAuth();
  const [userData, setUserData] = useState(null);
  const [imageIds, setImageIds] = useState({});
  const [profileImg, setProfileImg] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const [presaleData, sePresaleData]= useState(null);
  const location = useLocation();

    const { ledger_canister_id } = location.state || {};

  const fetchData = async () => {
    try {
      const actor = createCustomActor(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND);
      const ownerPrincipal = Principal.fromText(userPrincipal);
      const response = await actor.get_user_account(ownerPrincipal);
      console.log("Response-:", response);
      setUserData(response);
    
      
      // Getting profile image ID
      const profile_ImgId = await actor.get_profile_image_id();
      console.log("Image id", profile_ImgId[0]);
      const imageUrl = `${protocol}://${canisterId}.${domain}/f/${profile_ImgId[0]}`;
      setProfileImg(imageUrl);
      console.log("userImg", imageUrl);

      // Getting token image ID
      // if (ledgerPrincipalId) {
      //   const token_imageId = await actor.get_token_image_id(ledgerPrincipalId);
      //   setImageIds(prev => ({ ...prev, tokenId: token_imageId }));
      //   console.log("tokenImg", token_imageId);
      // }

      if (ledger_canister_id) {
        const ledgerPrincipalId= Principal.fromUint8Array(ledger_canister_id)
       const presaleData= await actor.get_sale_params(ledgerPrincipalId);
       sePresaleData(presaleData.Ok);
       console.log("presale data--",presaleData);
       }


    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && userPrincipal) {
      fetchData();
    }
  }, [isAuthenticated, userPrincipal]);


  const openModal = () => {
    setIsOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "About":
        return <ProjectTokenAbout />;
      case "Token":
        return <Token />;
      case "Pool Info":
        return <Pooolinfo />;
      case "FAQs & Discussion":
        return <FAQsDiscussion />;
      case "Previous Sale":
        return <PreviousSale />;
      default:
        return <ProjectTokenAbout />;
    }
  };

  const tabNames = [
    "About",
    "Token",
    "Pool Info",
    "FAQs & Discussion",
    "Previous Sale",

  ];

  const progress = 35.1;
  const raised = 30;
  const unsoldTokens = 368484;
  const currentRaised = 36;
  const saleType = "PUBLIC";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  return (
    <>
      <div className="flex flex-col gap-5 max-w-[90%] mx-auto lg:flex-row">
        <div className={` rounded-2xl  sm:bg-[#181818] mt-24 pb-5`}>
          {!isMobile && (
            <div className="h-[314px]">
              <div className="relative">
                
                <img
                  src={ProjectRectangleBg}
                  className="min-h-[147px] w-full rounded-lg"
                  alt=""
                />
                
                
                 <img
                  src={profileImg || person1} // Show person1 as a fallback if profileImg is not available yet
                  className="absolute  top-0 left-[50%] transform -translate-x-1/2 -translate-y-[35%] rounded-full object-cover   h-[130px] w-[130px]"
                  alt="Profile Picture"
                />

              </div>
              <div className="content-div flex font-posterama justify-between w-[90%] m-auto mt-7 ">
                <div className="left flex flex-col gap-5">
                  <div className="text-[25px]"> {userData ? userData[0]?.name : "PUPPO"}</div>
                  <div className="font-extralight">FAir Launnch - Max buy 5 SOL</div>
                  <div className="logos flex  gap-11">
                    <IoGlobeOutline className="size-6" />
                    <FaTwitter className="size-6" />
                    <FaFacebook className="size-6" />
                    <FaReddit className="size-6" />
                    <FaTelegram className="size-6" />
                    < FaInstagram className="size-6" />
                    <FaDiscord className="size-6" />
                  </div>
                </div>
                <div className="right flex flex-col gap-5">
                  <FiEdit3 />

                </div>
              </div>

              <div className="bg-[#FFFFFF66] h-[2px] w-[100%] mx-auto mt-4"></div>
            </div>
          )}

          {isMobile && (
            <div className="h-[314px] bg-[#181818] rounded-2xl py-5 flex flex-col">
              <div className="relative">
                <img
                  src={profileImg || person1}
                  className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[50%] rounded-full h-[130px] w-[130px]"
                  alt=""
                />
              </div>

              <div className="mt-[70px] text-center font-posterama text-white space-y-2">
                <div className="text-[24px] font-bold"> {userData ? userData[0]?.name : "PUPPO"} </div>
                <div className="text-[16px] font-medium">
                  FAir Launnch - Max buy 5 SOL
                </div>
                <div className="text-[#FFC145] text-[18px] font-semibold">
                  Upcoming
                </div>
                <div>
                  soft 100 sol
                </div>
              </div>

              <div className="bg-[#FFFFFF66] h-[2px] w-[100%] mx-auto mt-4 "></div>

              <div className="flex justify-evenly text-[25px] w-[90%] mt-4">
                <IoGlobeOutline />
                <FaTwitter />
                <FaFacebook />
                <FaReddit />
                <FaTelegram />
                < FaInstagram />
                <FaDiscord />
              </div>
            </div>
          )}

          {isMobile && (
            <div className="bg-[#FFFFFF1A] font-posterama text-[#FFFFFFA6] text-white p-6 mt-8 rounded-2xl w-full max-w-full">
              {/* Section Heading */}
              <h2 className="text-[25px]">OWNER SECTION</h2>

              {/* Sale Type */}
              <div className="mt-4 font-inter">
                <p className="text-[18px] ">Sale type</p>
                <div className="flex flex-col items-start gap-4 ml-4 mt-2">
                  <label className="flex  gap-4 items-center">
                    <input
                      type="radio"
                      name="saleType"
                      value="public"
                      checked={sellType === 'public'}
                      onChange={() => setSellType('public')}
                      className="hidden peer"
                    />
                    <div className="w-4 h-4 bg-transparent border-2 border-white  rounded-full  peer-checked:bg-gradient-to-r from-[#f09787]  to-[#CACCF5] flex items-center justify-center mr-2">
                      <div className="w-1.5 h-1.5 bg-transparent peer-checked:bg-gradient-to-r from-[#f09787]  to-[#CACCF5] rounded-full"></div>
                    </div>
                    Public
                  </label>

                  <label className="flex  gap-4 items-center">
                    <input
                      type="radio"
                      name="saleType"
                      value="whitelist"
                      checked={sellType === 'whitelist'}
                      onChange={() => setSellType('whitelist')}
                      className="hidden peer"
                    />
                    <div className="w-4 h-4 bg-transparent border-2 border-white  rounded-full  peer-checked:bg-gradient-to-r from-[#f09787]  to-[#CACCF5] flex items-center justify-center mr-2">
                      <div className="w-1.5 h-1.5 bg-transparent peer-checked:bg-gradient-to-r from-[#f09787]  to-[#CACCF5] rounded-full"></div>
                    </div>
                    Whitelist
                  </label>
                  <p className="ml-8 mt-[-10px]"> (Recommended For speed and private sale)</p>
                </div>
              </div>

              {/* Conditionally Render Add User to Whitelist Button */}

              {sellType === 'whitelist' && (
                <div>
                  <button onClick={openModal} className="w-full text-white  bg-gradient-to-r from-[#f09787]  to-[#CACCF5] rounded-3xl p-[1.5px] h-[40px] mt-2 ">
                    <div className='flex items-center bg-[#191919] justify-center  w-full h-full  rounded-3xl  '>
                      ADD USER TO WHITELIST
                    </div>
                  </button>
                  <AddToWhitelist modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
                </div>
              )}

              {/* Pool Actions */}
              <div className="mt-6">
                <p className="text-sm font-inter text-gray-400 mb-2">Pool Actions</p>

                {/* Buttons */}
                <div class="mx-auto flex  items-center justify-center ">
                  <button className="w-full text-white   bg-gradient-to-r from-[#f09787]  to-[#CACCF5] rounded-2xl p-[1.5px] h-[60px] mt-2 ">
                    <div className='flex items-center bg-[#191919] justify-center  w-full h-full  rounded-2xl  '>
                      POOL START/END TIME SETTING
                    </div>
                  </button>
                </div>
                <button className="w-full text-white bg-gradient-to-r from-[#f09787]  to-[#CACCF5]  rounded-3xl p-[1.5px] h-[40px]  mt-2 ">
                  <div className='flex items-center justify-center  bg-[#191919] w-full h-full  rounded-3xl  '>
                    HIDE TOKEN MATRIX CHART
                  </div>
                </button>
                <button className="w-full text-white bg-gradient-to-r from-[#f09787]  to-[#CACCF5]  rounded-3xl p-[1.5px] h-[40px]  mt-2">
                  <div className='flex items-center justify-center bg-[#191919] w-full h-full  rounded-3xl  '>
                    CANCEL POOL
                  </div>
                </button>
              </div>
            </div>
          )}


          {isMobile && (
            <div className="lg:min-w-[406px] w-full h-[153px] mt-8 bg-[#FFFFFF1A] rounded-[17.44px] flex flex-col justify-center items-center text-white">
              <p className="text-lg mb-2">SALE STARTS IN</p>
              <div className="text-2xl font-bold">00:29:23:00</div>
            </div>
          )}

          {isMobile && (
            <div className="bg-[#FFFFFF1A] text-white p-1 rounded-lg mt-8 flex w-full h-[350px] lg:min-w-[406px]">
              <div className="relative flex items-center  overflow-hidden w-[60%] h-72">
                <div className="absolute lg:left-[-45%] left-[-70%] dxs:left-[-47%] xxs1:left-[-30%] sm:left-[-20%] md:left-[-15%]  top-0 w-72 h-72">
                  <svg className="transform rotate-90" viewBox="0 0 36 36">
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#f3b3a7", stopOpacity: 1 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "#cac9f5", stopOpacity: 1 }}
                        />
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
                      strokeDasharray={`${progress}, 100`}
                    />
                  </svg>
                  <div className="absolute ml-10 inset-0 flex flex-col items-center justify-center">
                    <span>Progress</span>
                    <span className="text-lg font-semibold text-white">
                      {" "}
                      ({progress}%)
                    </span>
                    <span className="text-sm text-gray-400 mt-1">
                      {raised} SOL RAISED
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 w-[40%] flex flex-col justify-around ">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">SALE TYPE</span>
                  <span className="text-lg font-semibold">{saleType}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">UNSOLD TOKENS</span>
                  <span className="text-lg font-semibold">
                    {unsoldTokens.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">CURRENT RAISED</span>
                  <span className="text-lg font-semibold">
                    {currentRaised} ICP
                  </span>
                </div>
              </div>

            </div>
          )}

          {!isMobile && (
            <div className="max-w-[90%] mx-auto mt-6">
              <div className="flex justify-between font-posterama">
                {tabNames.map((tab) => (
                  <div
                    key={tab}
                    className={`cursor-pointer relative ${activeTab === tab
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
          )}
        </div>

        <div className="flex lg:flex-col flex-row gap-5 flex-wrap mt-[100px]">
          {!isMobile && (
            <div className="bg-[#FFFFFF1A] text-white p-1 rounded-lg flex w-full h-[350px] lg:min-w-[406px]">
              <div className="relative flex items-center  overflow-hidden w-[60%] h-72">
                <div className="absolute lg:left-[-45%] left-[-70%] dxs:left-[-47%] xxs1:left-[-30%] sm:left-[-20%] md:left-[-15%]  top-0 w-72 h-72">
                  <svg className="transform rotate-90" viewBox="0 0 36 36">
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#f3b3a7", stopOpacity: 1 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "#cac9f5", stopOpacity: 1 }}
                        />
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
                      strokeDasharray={`${progress}, 100`}
                    />
                  </svg>
                  <div className="absolute ml-10 inset-0 flex flex-col items-center justify-center">
                    <span>Progress</span>
                    <span className="text-lg font-semibold text-white">
                      {" "}
                      ({progress}%)
                    </span>
                    <span className="text-sm text-gray-400 mt-1">
                      {raised} SOL RAISED
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 w-[40%] flex flex-col justify-around ">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">SALE TYPE</span>
                  <span className="text-lg font-semibold">{saleType}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">UNSOLD TOKENS</span>
                  <span className="text-lg font-semibold">
                    {unsoldTokens.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">CURRENT RAISED</span>
                  <span className="text-lg font-semibold">
                    {currentRaised} ICP
                  </span>
                </div>
              </div>

            </div>
          )}

          {!isMobile && (
            <div className="lg:min-w-[406px] w-full h-[153px] bg-[#FFFFFF1A] rounded-[17.44px] flex flex-col justify-center items-center text-white">
              <p className="text-lg mb-2">SALE STARTS IN</p>
              <div className="text-2xl font-bold">00:29:23:00</div>
            </div>
          )}


          {!isMobile && (
            <div className="bg-[#FFFFFF1A] font-posterama text-[#FFFFFFA6] text-white p-6 rounded-lg w-full max-w-full">

              {/* Section Heading */}
              <h2 className="text-[25px]">OWNER SECTION</h2>

              {/* Sale Type */}
              <div className="mt-4 font-inter">
                <p className="text-[18px] text-gray-400">Sale type</p>
                <div className="flex items-center space-x-11 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="saleType"
                      value="public"
                      checked={sellType === 'public'}
                      onChange={() => setSellType('public')}
                      className="hidden peer"
                    />
                    <div className="w-4 h-4 bg-transparent border-2 border-white  rounded-full  peer-checked:bg-gradient-to-r from-[#f09787]  to-[#CACCF5] flex items-center justify-center mr-2">
                      <div className="w-1.5 h-1.5 bg-transparent peer-checked:bg-gradient-to-r from-[#f09787]  to-[#CACCF5] rounded-full"></div>
                    </div>
                    Public
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="saleType"
                      value="whitelist"
                      checked={sellType === 'whitelist'}
                      onChange={() => setSellType('whitelist')}
                      className="hidden peer"
                    />
                    <div className="w-4 h-4 bg-transparent border-2 border-white  rounded-full  peer-checked:bg-gradient-to-r from-[#f09787]  to-[#CACCF5] flex items-center justify-center mr-2">
                      <div className="w-1.5 h-1.5 bg-transparent peer-checked:bg-gradient-to-r from-[#f09787]  to-[#CACCF5] rounded-full"></div>
                    </div>
                    Whitelist
                  </label>
                </div>
              </div>

              {/* Conditionally Render Add User to Whitelist Button */}

              {sellType === 'whitelist' && (
                <div>
                  <button onClick={openModal} className="w-full text-white  bg-gradient-to-r from-[#f09787]  to-[#CACCF5] rounded-3xl p-[1.5px] h-[40px] mt-2 ">
                    <div className='flex items-center bg-[#191919] justify-center  w-full h-full  rounded-3xl  '>
                      ADD USER TO WHITELIST
                    </div>
                  </button>
                  <AddToWhitelist modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
                </div>
              )}

              {/* Pool Actions */}
              <div className="mt-6">
                <p className="text-sm font-inter text-gray-400 mb-2">Pool Actions</p>

                {/* Buttons */}
                <div class="mx-auto flex  items-center justify-center ">
                  <button className="w-full text-white  bg-gradient-to-r from-[#f09787]  to-[#CACCF5] rounded-3xl p-[1.5px] h-[40px] mt-2 ">
                    <div className='flex items-center bg-[#191919] justify-center  w-full h-full  rounded-3xl  '>
                      POOL START/END TIME SETTING
                    </div>
                  </button>
                </div>
                <button className="w-full text-white bg-gradient-to-r from-[#f09787]  to-[#CACCF5]  rounded-3xl p-[1.5px] h-[40px]  mt-2 ">
                  <div className='flex items-center justify-center  bg-[#191919] w-full h-full  rounded-3xl  '>
                    HIDE TOKEN MATRIX CHART
                  </div>
                </button>
                <button className="w-full text-white bg-gradient-to-r from-[#f09787]  to-[#CACCF5]  rounded-3xl p-[1.5px] h-[40px]  mt-2">
                  <div className='flex items-center justify-center bg-[#191919] w-full h-full  rounded-3xl  '>
                    CANCEL POOL
                  </div>
                </button>
              </div>
            </div>
          )}

        </div>
        {isMobile && <MobileViewTab />}
      </div>
    </>
  );
};

export default TokenPage;