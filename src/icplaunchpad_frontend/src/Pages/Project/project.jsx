import React, { useState, useEffect } from "react";
import ProjectRectangleBg from "../../../assets/images/project-rectangle-bg.png";
import { FaFacebook, FaTwitter, FaReddit, FaInstagram, FaDiscord } from "react-icons/fa";
import { IoGlobeOutline } from "react-icons/io5";
import { FaTelegram } from "react-icons/fa6";

import person1 from "../../../assets/images/carousel/person1.png";
import ProjectTokenAbout from "./about/ProjectTokenAbout.jsx";
import AffiliateProgram from "./AffiliateProgram/AffiliateProgram.jsx";
import FAQsDiscussion from "./FAQsDiscussion/FAQsDiscussion.jsx";
import Pooolinfo from "./pooolinfo/Pooolinfo.jsx";
import Token from "./token/Token.jsx";
import Tokenomic from "./Tokenomic/Tokenomic.jsx";
import MobileViewTab from "./MobileViewTab.jsx";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../StateManagement/useContext/useAuth.jsx";
import { Principal } from "@dfinity/principal";
import SaleStart from "../OwnerSection/SaleStart.jsx";
import { getSocialLogo } from "../../common/getSocialLogo.jsx";

const TokenPage = () => {
  const [tokenPhase, setTokenPhase] = useState("UPCOMING");
  const [activeTab, setActiveTab] = useState("About");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const location = useLocation();
  const { projectData } = location.state || {};
  const { actor, createCustomActor } = useAuth();
  const [saleParams, setSaleParams] = useState(null);
  const [ledgerActor, setLedgerActor] = useState(null);
  const [tokenOwnerInfo, setTokenOwnerInfo] = useState(null);
  const [amount, setAmount] = useState();

  useEffect(() => {
    
    const fetchTokenData = async () => {
      if (projectData?.canister_id) {
        console.log("projectData=>",projectData)
        try {
          const ledgerPrincipal = Principal.fromText(projectData.canister_id);
          const ledgerActor = await createCustomActor(ledgerPrincipal);
          setLedgerActor(ledgerActor);

          // Fetching the owner of the token
          const owner = await ledgerActor.icrc1_minting_account();
          if (owner) {
            const ownerBalance = await ledgerActor.icrc1_balance_of(owner[0]);
            setTokenOwnerInfo({
              owner_bal: ownerBalance.toString(),
              owner: owner[0].owner.toString(),
            });
          }
        } catch (error) {
          console.error("Error fetching token data:", error);
        }
      }
    };

    const fetchSaleParams = async () => {
      if (actor && projectData?.canister_id) {
        try {
          const ledgerPrincipal = Principal.fromText(projectData.canister_id);
          const sale = await actor.get_sale_params(ledgerPrincipal);

          if (sale?.Ok) {
            console.log(sale?.Ok)
            setSaleParams(sale.Ok);
          } else {
            console.warn("No sale data available or an error occurred.");
          }
        } catch (error) {
          console.error("Error fetching sale parameters:", error);
        }
      }
    };

    fetchTokenData();
    fetchSaleParams();
  }, [actor, projectData?.canister_id, createCustomActor]);

  const renderContent = () => {
    switch (activeTab) {
      case "About":
        return <ProjectTokenAbout presaleData={saleParams} />;
      case "Token":
        return <Token ledgerId={projectData?.canister_id} />;
      case "Pool Info":
        return <Pooolinfo presaleData={saleParams} poolData={projectData ? { ...projectData, total_supply: projectData?.total_supply } : {}} />;
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

  const tabNames = [
    "About",
    "Token",
    "Pool Info",
    "Affiliate Program",
    "Tokenomic",
    "FAQs & Discussion",
  ];

  const progress = 35.1;
  const raised = 30;
  const unsoldTokens = 368484;
  const currentRaised = 36;
  const saleType = "PUBLIC";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAmount = (e) => {
    if (saleParams) {
      const val = e.target.value;
      setAmount(saleParams.listing_rate * val);
    }
  };

  const handleTransaction = async () => {
    if (ledgerActor) {
      const res = await ledgerActor.icrc2_approve();
      console.log(res);
    }
  };

  return (
    <>
      <div className="flex flex-col  gap-5 max-w-[90%] mx-auto lg:flex-row">
        <div className={`bg-[#FFFFFF1A] rounded-lg  mt-24 pb-5`}>
          {!isMobile && (
            <div className="h-[314px]">
              <div className="relative">
                <img
                  src={projectData.cover_image ? projectData.cover_image : ProjectRectangleBg}
                  className=" max-h-[147px] w-[90vw] rounded-lg object-cover"
                  alt=""
                />
                <img
                  src={projectData ? projectData.token_image : person1}
                  className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[35%] rounded-full h-[130px] md:min-h-[177px] object-cover w-[130px]  md:w-[177px]"
                  alt="token pic"
                />
              </div>
              <div className="content-div font-posterama flex justify-between w-[90%] m-auto mt-7 ">
                <div className="left flex flex-col gap-5">
                  <div> {projectData && projectData?.token_name} </div>
                  <div>FAir Launnch - Max buy 5 SOL</div>
                  <div className="logos flex  gap-11">
                    {
                      (saleParams && saleParams.social_links.length > 0) ?
                        saleParams.social_links.map((link, index) => {
                          console.log('link=', link)
                          return <a href={link} key={index}> {getSocialLogo(link)} </a>
                        })
                        :
                        <>
                          <IoGlobeOutline className="size-6" />
                          <FaTwitter className="size-6" />
                          <FaFacebook className="size-6" />
                          <FaReddit className="size-6" />
                          <FaTelegram className="size-6" />
                          < FaInstagram className="size-6" />
                          <FaDiscord className="size-6" />
                        </>
                    }
                  </div>
                </div>
                <div className="right flex flex-col text-[17px] mr-8 lgx:mr-0 gap-4">
                  <div className="text-[#FFC145]"> {tokenPhase} </div>
                  <div>Soft 100 SOL</div>
                </div>
              </div>
              <div className="bg-[#FFFFFF66] h-[2px] max-w-[90%] mx-auto mt-4"></div>
            </div>
          )}

          {isMobile && (
            <div className="h-[314px] bg-[#181818] rounded-lg py-5 flex flex-col">
              <div className="relative">
                <img
                  src={projectData ? projectData.TokenImg : person1}
                  className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[50%] object-cover rounded-full h-[130px] w-[130px] md:min-h-[177px] md:min-w-[177px]"
                  alt=""
                />
              </div>

              <div className="mt-[70px] font-posterama text-center text-white space-y-2">
                <div className=" text-[24px] font-bold"> {projectData && projectData?.token_name}</div>
                <div className=" text-[16px] font-medium">
                  FAir Launnch - Max buy 5 SOL
                </div>
                <div className="text-[#FFC145] text-[18px] font-semibold">
                  Upcoming
                </div>
                <div className="text-[16px]">Soft 100 SOL</div>
              </div>

              <div className="bg-[#FFFFFF66] h-[2px] w-[100%] mx-auto mt-4"></div>

              <div className="flex justify-center gap-4  dxs:gap-9 text-[23px] w-[100%] mt-4">
                {
                  (saleParams && saleParams.social_links.length > 0) ?
                    saleParams.social_links.map((link, index) => {
                      console.log('link=', link)
                      return <a href={link} key={index}> {getSocialLogo(link)} </a>
                    })
                    :
                    <>
                      <IoGlobeOutline className="size-6" />
                      <FaTwitter className="size-6" />
                      <FaFacebook className="size-6" />
                      <FaReddit className="size-6" />
                      <FaTelegram className="size-6" />
                      < FaInstagram className="size-6" />
                      <FaDiscord className="size-6" />
                    </>
                }
              </div>
            </div>
          )}

          {!isMobile && (
            <div className="max-w-[90%] mx-auto">
              <div className="flex font-posterama text-[10px] xl:text-[15px]  justify-between">
                {tabNames.map((tab) => (
                  <div
                    key={tab}
                    className={`cursor-pointer relative ${activeTab === tab
                        ? "before:absolute before:left-0 before:right-0 before:top-5 before:h-[2px] before:bg-gradient-to-r before:from-[#F3B3A7] before:to-[#CACCF5] before:rounded"
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
        <div className="flex lg:flex-col flex-row gap-5 flex-wrap">
          <div className="lg:min-w-[406px] bg-[#FFFFFF1A] rounded-[17.44px] p-5 text-white relative h-[218px] lg:mt-24 w-full">
            <p className="text-lg mb-2">AMOUNT</p>
            <input
              type="number"
              className="w-full p-2 rounded-md bg-[#333333] border-none text-white text-base mb-5 "
              placeholder="Enter Amount"
              onChange={handleAmount}
            />
            {/* token amount per icp */}
            <h1 className="mb-5 text-green-500"> {amount && ` ${amount} ICP `} </h1>

            <button onClick={handleTransaction} className="w-[50%] p-2 rounded-2xl   font-semibold  bg-gradient-to-r from-[#f3b3a7] to-[#cac9f5] text-black text-base">
              USE ICP
            </button>
          </div>

          <div className="bg-[#FFFFFF1A] text-white p-1 rounded-lg flex flex-col ss2:flex-row    w-full lg:min-w-[406px]">
            <div className="relative flex  items-center  overflow-hidden w-full ss2:w-[60%] h-72">
              <div className="absolute left-[-33%] lg:left-[-45%] ss2:left-[-70%] dxs:left-[-47%] xxs1:left-[-30%] sm:left-[-20%] md:left-[-15%] top-0 w-72 h-72">
                <svg style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
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
                    strokeDasharray={`${projectData.saleProgress ? projectData.saleProgress  : 0}, 100`}
                  />
                </svg>
                <div className="absolute ml-12 ss2:ml-28 dxs:ml-10 inset-0 flex flex-col items-center justify-center">
                  <span>Progress</span>
                  <span className="text-lg font-semibold text-white">
                    ({projectData.saleProgress ? projectData.saleProgress  : 0 }%)
                  </span>
                  <span className="text-[11px] ss2:text-sm text-gray-400 mt-1">
                  {tokenOwnerInfo ? tokenOwnerInfo.owner_bal : 0} ICP RAISED
                  </span>
                </div>
              </div>

            </div>

            <div className="mt-6 w-[40%] gap-4 sxs3:gap-8 px-2 relative  flex ss2:flex-col  justify-around ">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">SALE TYPE</span>
                <span className="text-lg font-semibold">{saleType}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">UNSOLD TOKENS</span>
                <span className="text-lg font-semibold">
                  {projectData ? ` ${projectData.total_supply.toString()} ${projectData.token_symbol}` : ''}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">CURRENT RAISED</span>
                <span className="text-lg font-semibold">
                  {tokenOwnerInfo ? tokenOwnerInfo.owner_bal : 0} ICP
                </span>
              </div>
            </div>
          </div>

          <div className="lg:min-w-[406px] w-full h-[153px] bg-[#FFFFFF1A] rounded-[17.44px] flex flex-col justify-center items-center text-white">
            <SaleStart style={{ text_heading: 'text-lg', text_content: 'text-2xl' }} setTokenPhase={setTokenPhase} presaleData={saleParams} />
          </div>
        </div>
        {isMobile && <MobileViewTab ledgerId={projectData?.canister_id}
          presaleData={saleParams} poolData={projectData ? { ...projectData, total_supply: projectData?.total_supply } : {}}
        />}
      </div>
    </>
  );
};

export default TokenPage;