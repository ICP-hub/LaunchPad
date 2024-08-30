import React, { useState } from "react";
import ProjectRectangleBg from "../../assets/images/project-rectangle-bg.png";
import tokenHolder from "../../assets/images/tokenHolder.png";
import facebook from "../../assets/images/logos/facebook.png";
import instagram from "../../assets/images/logos/instagram.png";
import telegram from "../../assets/images/logos/telegram.png";
import noi from "../../assets/images/logos/Noi.png";
import noi2 from "../../assets/images/logos/noi2.png";
import twiiter from "../../assets/images/logos/twitter.png";
import web from "../../assets/images/logos/web.png";
import ProjectTokenAbout from "./about/ProjectTokenAbout";
import AffiliateProgram from "./AffiliateProgram/AffiliateProgram";
import FAQsDiscussion from "./FAQsDiscussion/FAQsDiscussion";
import Pooolinfo from "./pooolinfo/Pooolinfo";
import Token from "./token/Token";
import Tokenomic from "./Tokenomic/Tokenomic";

const Projects = () => {
  const [activeTab, setActiveTab] = useState("About");

  const renderContent = () => {
    switch (activeTab) {
      case "About":
        return <ProjectTokenAbout />;
      case "Token":
        return <Token />;
      case "Pool Info":
        return <Pooolinfo />;
      case "Affiliate Program":
        return <AffiliateProgram />;
      case "Tokenomic":
        return <Tokenomic />;
      case "FAQs & Discussion":
        return <FAQsDiscussion />;
      default:
        return <ProjectTokenAbout />;
    }
  };

  const progress = 35.1;
  const raised = 30;
  const unsoldTokens = 368484;
  const currentRaised = 36;
  const saleType = "PUBLIC";

  return (
    <>
      <div className="flex flex-col gap-5 max-w-[90%] mx-auto lg:flex-row">
        <div className="min-h-[1150px] bg-[#FFFFFF1A] mt-24 max-w-[902px]">
          <div className="h-[314px]">
            <div className="relative">
              <img src={ProjectRectangleBg} className="min-h-[147px]" alt="" />
              <img
                src={tokenHolder}
                className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[35%] rounded-full min-h-[177px]"
                alt=""
              />
            </div>
            <div>
              <div className="content-div flex justify-between w-[90%] m-auto mt-7 ">
                <div className="left flex flex-col gap-5">
                  <div>PuPPo</div>
                  <div>FAir Launnch - Max buy 5 SOL</div>
                  <div className="logos flex gap-5">
                    <img
                      src={web}
                      className="h-full w-full cursor-pointer"
                      alt=""
                    />
                    <img
                      src={twiiter}
                      className="h-full w-full cursor-pointer"
                      alt=""
                    />
                    <img
                      src={facebook}
                      className="h-full w-full cursor-pointer"
                      alt=""
                    />
                    <img
                      src={noi}
                      className="h-full w-full cursor-pointer"
                      alt=""
                    />
                    <img
                      src={telegram}
                      className="h-full w-full cursor-pointer"
                      alt=""
                    />
                    <img
                      src={instagram}
                      className="h-full w-full cursor-pointer"
                      alt=""
                    />
                    <img
                      src={noi2}
                      className="h-full w-full cursor-pointer"
                      alt=""
                    />
                  </div>
                </div>
                <div className="right flex flex-col gap-5">
                  <div>Upcoming</div>
                  <div>Soft 100 SOL</div>
                </div>
              </div>
            </div>
            <div className="bg-[#FFFFFF66] h-[2px] max-w-[90%] mx-auto mt-4"></div>
          </div>
          <div className="max-w-[90%] mx-auto">
            <div className="flex justify-between">
              <div
                className="cursor-pointer"
                onClick={() => setActiveTab("About")}
              >
                About
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setActiveTab("Token")}
              >
                Token
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setActiveTab("Pool Info")}
              >
                Pool Info
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setActiveTab("Affiliate Program")}
              >
                Affiliate Program
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setActiveTab("Tokenomic")}
              >
                Tokenomic
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setActiveTab("FAQs & Discussion")}
              >
                FAQs & Discussion
              </div>
            </div>
            <div className="mt-5">{renderContent()}</div>
          </div>
        </div>

        <div className="flex lg:flex-col flex-row gap-5 flex-wrap ">
          <div className="lg:min-w-[406px] bg-[#FFFFFF1A] rounded-[17.44px] p-5 text-white relative h-[218px] lg:mt-24 w-full">
            <p className="text-lg mb-2">AMOUNT</p>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-[#333333] border-none text-white text-base mb-5"
              placeholder="Enter Amount"
            />
            <button className="w-full p-2 rounded-md bg-gradient-to-r from-[#f3b3a7] to-[#cac9f5] text-white text-base">
              USE ICP
            </button>
          </div>

          <div className="bg-[#FFFFFF1A] text-white p-1 rounded-lg flex w-full lg:min-w-[406px]">
            <div className="relative flex items-center  overflow-hidden w-[60%] h-72">
              <div className="absolute lg:left-[-45%] left-[-30%] sm:left-[-20%] md:left-[-15%]  top-0 w-72 h-72">
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

          <div className="lg:min-w-[406px] w-full h-[153px] bg-[#FFFFFF1A] rounded-[17.44px] flex flex-col justify-center items-center text-white">
            <p className="text-lg mb-2">SALE STARTS IN</p>
            <div className="text-2xl font-bold">00:29:23:00</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
