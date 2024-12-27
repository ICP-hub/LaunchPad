import React, { useState, useEffect } from "react";
import ProjectRectangleBg from "../../../assets/images/project-rectangle-bg.png";

import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { IoGlobeOutline } from "react-icons/io5";
import { FaTelegram } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";

import person1 from "../../../assets/images/carousel/user.png"
import ProjectTokenAbout from "./about/ProjectTokenAbout";
import FAQsDiscussion from "./FAQsDiscussion/FaqDiscussionTab.jsx";
import Pooolinfo from "./pooolinfo/Pooolinfo";
import Token from "./token/Token";
import MobileViewTab from "./MobileViewTab";
import { FiEdit3 } from "react-icons/fi";
import { PiHandDepositFill } from "react-icons/pi";

import AddToWhitelist from "../../components/Modals/AddToWhitelist.jsx";
import { Principal } from '@dfinity/principal';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import UpdateToken from "../../components/Modals/UpdateToken.jsx";
import { SaleParamsHandlerRequest } from "../../StateManagement/Redux/Reducers/SaleParams.jsx";
import SaleStart from "./SaleStart.jsx";
import { getSocialLogo } from "../../common/getSocialLogo.jsx";
import { useAuths } from "../../StateManagement/useContext/useClient.jsx";
import RaisedFundProgress from "../../common/RaisedFundProgress.jsx";
import Tokenomic from "./Tokenomics/Tokenomics.jsx";
import ICP_TopUp1 from "../../components/Modals/ICP_TopUp1.jsx";
import ICP_TopUp2 from "../../components/Modals/ICP_TopUp2.jsx";
import { fetchWithRetry } from "../../utils/fetchWithRetry";
import Skeleton from "react-loading-skeleton";
import TokenTransactions from "../../common/TokenTransactions/TokenTransactions";
import { formatCycles } from "../../common/formatCycles";
import UpdatePoolDate from "../../components/Modals/UpdatePoolDate";
// import ICP_TopUp2 from "../../components/Modals/ICP_TopUp2.jsx";

const TokenPage = () => {
  const [activeTab, setActiveTab] = useState("About");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [sellType, setSellType] = useState('public');
  const [modalIsOpen, setIsOpen] = useState(false);
  const [tokenModalIsOpen, setTokenModalIsOpen] = useState(false)
  const [PoolDateModalIsOpen,setPoolDateModalIsOpen]=useState(false)
  const [isTopUpModal1, setTopUpModal1] = useState(false)
  const [isTopUpModal2, setTopUpModal2] = useState(false)
  const [tokenPhase, setTokenPhase] = useState("UPCOMING");
  const [topUpCansiter, setTopUpCansiter] = useState('')
  const location = useLocation();
  const { projectData } = location.state || {};
  const { createCustomActor, isAuthenticated, principal } = useAuths();
  const [tokenData, setTokenData] = useState(null);
  const [tokenImg, setTokenImg] = useState();
  const [coverImg, setCoverImg] = useState();
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const [ledgerActor, setLedgerActor] = useState(null);
  const [presaleData, setPresaleData] = useState(null);
  const [renderComponent, setRenderComponent] = useState(false);
  const [saleProgress, setSaleProgress] = useState(0);
  const [balance, setBalance] = useState(0);

  const actor = useSelector((currState) => currState.actors.actor);
  console.log(actor)
  // const presale = useSelector((state) => state.SaleParams.data.Ok);
  const dispatch = useDispatch()

  console.log('project data', projectData)
  // const location = useLocation();

  // useEffect(() => {

  //     const progress = tokenData && projectData ? (100 - (Number(tokenData.total_supply) / Number(projectData.total_supply)) * 100) : 0;
  //     setSaleProgress(progress.toFixed(2))

  // }, [tokenPhase, tokenData]);


  function handleTokenEdit() {
    setTokenModalIsOpen(true)
  }

  function handleTopUp() {
    setTopUpModal1(true)
  }

  const ledgerSelect = useSelector((state) => state?.LedgerId?.data?.ledger_canister_id);
  const ledger_canister_id = projectData?.canister_id ?? ledgerSelect;
  console.log("ledgerCanister:", ledger_canister_id);


  // Fetch Sale Parameters
  const getSaleParams = async () => {
    console.log('useEffect 1 enter', ledger_canister_id)
    try {
      if (ledger_canister_id) {
        const ledgerId = typeof ledger_canister_id !== 'string'
          ? Principal.fromUint8Array(ledger_canister_id)
          : Principal.fromText(ledger_canister_id);

        const presale = await actor.get_sale_params(ledgerId);
        console.log('presale-->', presale)
        if (presale?.Ok) {

          setPresaleData(presale.Ok);
        } else {
          console.warn("Sale parameters not found:", presale);
        }
      }
    } catch (error) {
      console.error("Error fetching sale parameters:", error);
    }
  };

  const getBalance = async () => {
    if (ledger_canister_id) {
      const ledgerId = typeof ledger_canister_id !== 'string'
        ? Principal.fromUint8Array(ledger_canister_id)
        : Principal.fromText(ledger_canister_id);

      const balance = await actor.fetch_canister_balance(ledgerId);
      if(balance.Ok)
       setBalance(Number(balance.Ok))

      console.log('balance==', balance)
    }
  }

  console.log('useEffect 1')
  useEffect(() => {
    if (ledger_canister_id || renderComponent) {
      getSaleParams();
      getBalance();
    }
  }, [actor,ledger_canister_id, renderComponent]);

  // Fetch Token Data
  const fetchData = async () => {
    console.log('useEffect 2 enter');
    try {
      if (ledger_canister_id) {
        const ledgerId = typeof ledger_canister_id !== 'string'
          ? Principal.fromUint8Array(ledger_canister_id)
          : Principal.fromText(ledger_canister_id);

        const ledgerActor = await createCustomActor(ledgerId);
        setLedgerActor(ledgerActor);
  
        // Fetch Token Details with retry logic
        const tokenDataResults = await Promise.allSettled([
          fetchWithRetry(() => ledgerActor.icrc1_name(), 3, 1000),
          fetchWithRetry(() => ledgerActor.icrc1_symbol(), 3, 1000),
          fetchWithRetry(() => ledgerActor.icrc1_total_supply(), 3, 1000),
        ]);
  
        console.log("Token Data Results:", tokenDataResults);
  
        const tokenName = tokenDataResults[0].status === "fulfilled" ? tokenDataResults[0].value : null;
        const tokenSymbol = tokenDataResults[1].status === "fulfilled" ? tokenDataResults[1].value : null;
        const totalSupply = tokenDataResults[2].status === "fulfilled" ? tokenDataResults[2].value : null;
  
        if (tokenName && tokenSymbol && totalSupply) {
          setTokenData({
            canister_id: ledger_canister_id,
            token_name: tokenName,
            token_symbol: tokenSymbol,
            total_supply: totalSupply,
          });
        } else {
          console.error("Failed to fetch some token data.");
        }
  
        // Fetch fund raised
        if (ledgerId) {
          const fundRaised = await actor.get_funds_raised(ledgerId)
          console.log('fundRaised====',fundRaised)
   
          setTokenData((prevData) => ({
            ...prevData,
            fund_raised: fundRaised?.Ok.toString() || '0',
          }));
        }
  
        // Fetch Token Image and Cover Image
        const [tokenImgResult, coverImgResult] = await Promise.allSettled([
          fetchWithRetry(() => actor.get_token_image_id(ledgerId), 3, 1000),
          fetchWithRetry(() => actor.get_cover_image_id(ledgerId), 3, 1000),
        ]);
  
        if (tokenImgResult.status === "fulfilled" && tokenImgResult.value?.Ok) {
          setTokenImg(`${protocol}://${canisterId}.${domain}/f/${tokenImgResult.value?.Ok}`);
        } else {
          console.warn("Token image ID not found:", tokenImgResult);
        }
  
        if (coverImgResult.status === "fulfilled" && coverImgResult.value?.Ok) {
          setCoverImg(`${protocol}://${canisterId}.${domain}/f/${coverImgResult.value?.Ok}`);
        } else {
          console.warn("Cover image ID not found:", coverImgResult);
        }
  
        // Fetch Presale Data
        if (!projectData) {
          dispatch(SaleParamsHandlerRequest());
        }
      }
    } catch (error) {
      console.error("Error fetching token data:", error);
    }
  };
  

  console.log('useEffect 2')
  useEffect(() => {
    if ((isAuthenticated && actor && ledger_canister_id) || renderComponent) {
      fetchData();
    }
  }, [isAuthenticated, actor, ledger_canister_id, renderComponent]);


  const openModal = () => {
    setIsOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "About":
        return <ProjectTokenAbout presaleData={presaleData} />;
      case "Token":
        return <Token ledger_canister_id={ledger_canister_id} actor={ledgerActor} />;
      case "Pool Info":
        return <Pooolinfo presaleData={presaleData} poolData={tokenData ? tokenData : ''} />;
      case "FAQs & Discussion":
        return <FAQsDiscussion />;
      case "Tokenomic":
        return <Tokenomic />;
      case "Transactions":
        return <TokenTransactions actor={ledgerActor} />;
      default:
        return <ProjectTokenAbout presaleData={presaleData} />;
    }
  };

  const tabNames = [
    "About",
    "Token",
    "Pool Info",
    "Tokenomic",
    "Transactions",
    "FAQs & Discussion",

  ];

  // const progress = 35.1;
  // const raised = 30;
  // const unsoldTokens = 368484;
  // const currentRaised = 36;
  // const saleType = "PUBLIC";

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
      <div className="flex flex-col gap-5 max-w-[95%] mx-auto lg:flex-row">
        <div className={` rounded-2xl  sm:bg-[#181818] mt-24 pb-5`}>
          {!isMobile && (
            <div className="h-[314px]">
              <div className="relative">

                <img
                  src={coverImg || ProjectRectangleBg}
                  className="max-h-[147px] object-cover w-[100vw] rounded-lg"
                  alt=""
                  draggable="false"
                />


                <img
                  src={tokenImg || person1} // Show person1 as a fallback if tokenImg is not available yet
                  className="absolute  top-0 left-[50%] transform -translate-x-1/2 -translate-y-[35%] rounded-full object-cover   h-[130px] w-[130px]"
                  alt="Profile Picture"
                  draggable="false"
                />

              </div>
              <div className="content-div font-posterama flex justify-between w-[90%] m-auto mt-7 ">
                <div className="left flex flex-col gap-4">
                  <div className="text-[24px]"> {tokenData ? tokenData.token_name : <Skeleton width={150} height={25} />} </div>
                  <div className="font-extralight"> Fair Launch </div>
                  <div className="logos flex  gap-11">
                    {
                      (presaleData && presaleData.social_links.length > 0) ?
                        presaleData.social_links.map((link, index) => {
                          console.log('link=', link)
                          return <a href={link} target="blank" key={index}> {getSocialLogo(link)} </a>
                        })
                        :
                        <>
                          <IoGlobeOutline className="size-6" />
                          <FaTwitter className="size-6" />
                          <FaFacebook className="size-6" />
                          <FaTelegram className="size-6" />
                          <FaDiscord className="size-6" />
                        </>
                    }
                  </div>
                </div>
                <div className="right w-48 xl:w-40 flex flex-col gap-5">
                  <div className=" flex justify-end items-center">
                    <FiEdit3 onClick={handleTokenEdit} className="cursor-pointer ml-32 xl:ml-32" />
                  </div>

                  <div className=" flex justify-end items-center">
                    <input className=" text-white bg-black h-full text-center w-24 xl:w-28 px-2  outline-none" readOnly value={formatCycles(balance)} />
                    <PiHandDepositFill onClick={handleTopUp} className="ml-2 h-7 w-7 cursor-pointer " />
                  </div>

                </div>
              </div>

              <div className="bg-[#FFFFFF66] h-[2px] max-w-[90%] mx-auto mt-4"></div>
            </div>
          )}

          {/* UpdateModal*/}
          {tokenData && <UpdateToken ledgerId={tokenData.canister_id} setRenderComponent={setRenderComponent} tokenModalIsOpen={tokenModalIsOpen} setTokenModalIsOpen={setTokenModalIsOpen} />}

          {/* TopUpModal*/}
          {balance ? <ICP_TopUp1 isTopUpModal1={isTopUpModal1} setTopUpModal1={setTopUpModal1} setTopUpModal2={setTopUpModal2} topUpCansiter={topUpCansiter} setTopUpCansiter={setTopUpCansiter} /> : ''}
          <ICP_TopUp2 isTopUpModal2={isTopUpModal2} setTopUpModal2={setTopUpModal2} setTopUpModal1={setTopUpModal1} topUpCansiter={topUpCansiter} />

          {isMobile && (
            <div className="h-[345px] relative bg-[#181818] rounded-2xl py-5 flex flex-col">
              <div className="relative">
                <img
                  src={tokenImg || person1}
                  className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[50%] rounded-full h-[130px] w-[130px]"
                  alt=""
                  draggable="false"
                />
              </div>

              <div className="mt-[70px] text-center font-posterama text-white space-y-2">
                <div className=" ">
                  <div className="text-[24px] font-bold"> {tokenData ? tokenData.token_name : <Skeleton width={150} height={25} />} </div>
                  <FiEdit3 onClick={handleTokenEdit} className="cursor-pointer absolute right-5 top-4 " />

                </div>

                <div className="righttext-[16px] font-medium">
                  Fair Launch
                </div>
                <div className="text-[#FFC145] text-[18px] font-semibold">
                  {tokenPhase}
                </div>
                <div>
                  {`Softcap ${presaleData?.softcap} ICP `}
                </div>
                <div className=" flex justify-center mx-auto items-center">
                  <input className=" text-white bg-black h-full text-center w-28 px-2 outline-none" readOnly value={formatCycles(balance)} />
                  <PiHandDepositFill onClick={handleTopUp} className="ml-2 h-7 w-7 cursor-pointer " />
                </div>
              </div>

              <div className="bg-[#FFFFFF66] h-[2px] w-[100%] mx-auto mt-4 "></div>

              <div className="flex justify-center   gap-4  dxs:gap-9  ss2:text-[23px] w-[100%] mt-4">
                {
                  (presaleData && presaleData.social_links.length > 0) ?
                    presaleData.social_links.map((link, index) => {
                      console.log('link=', link)
                      return <a href={link} key={index} target="blank"   > {getSocialLogo(link)} </a>
                    })
                    :
                    <>
                      <IoGlobeOutline className="size-6" />
                      <FaTwitter className="size-6" />
                      <FaFacebook className="size-6" />
                      <FaTelegram className="size-6" />
                      <FaDiscord className="size-6" />
                    </>
                }
              </div>
            </div>
          )}

          {isMobile && (
            <div className="bg-[#FFFFFF1A] font-posterama text-[#FFFFFFA6] text-white p-3 xxs1:p-6 mt-8 rounded-2xl w-full max-w-full">
              {/* Section Heading */}
              <h2 className=" text-[22px] ss2:text-[25px]">OWNER SECTION</h2>

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
                <div className="mx-auto flex  items-center justify-center ">
                  <button className="w-full text-white   bg-gradient-to-r from-[#f09787]  to-[#CACCF5] rounded-2xl p-[1.5px] h-[60px] mt-2 ">
                    <div onClick={()=>setPoolDateModalIsOpen(true)} className='flex items-center bg-[#191919] text-[13px] ss2:text-[17px] justify-center  w-full h-full  rounded-2xl  '>
                      POOL START/END TIME SETTING
                    </div>
                  </button>
                </div>
                <button className="w-full text-white bg-gradient-to-r from-[#f09787]  to-[#CACCF5]  rounded-3xl p-[1.5px] h-[40px]  mt-2 ">
                  <div className='flex items-center justify-center text-[13px] ss2:text-[17px]   bg-[#191919] w-full h-full  rounded-3xl  '>
                    HIDE TOKEN MATRIX CHART
                  </div>
                </button>
                <button className="w-full text-white bg-gradient-to-r from-[#f09787]  to-[#CACCF5]  rounded-3xl p-[1.5px] h-[40px]  mt-2">
                  <div className='flex items-center justify-center text-[13px] ss2:text-[17px] bg-[#191919] w-full h-full  rounded-3xl  '>
                    CANCEL POOL
                  </div>
                </button>
              </div>
            </div>
          )}


          {isMobile && (
            <div className="lg:min-w-[406px] w-full h-[153px] mt-8 bg-[#FFFFFF1A] rounded-[17.44px] flex flex-col justify-center items-center text-white">{console.log('presaleDatapresaleData=', presaleData)}
              <div className="text-2xl font-bold"> <SaleStart style={{ text_heading: 'text-lg', text_content: 'text-2xl' }} setTokenPhase={setTokenPhase} presaleData={presaleData && presaleData} /> </div>
            </div>
          )}

          {isMobile && (
            <div className="bg-[#FFFFFF1A] text-white p-1 rounded-lg mt-8 flex w-full h-[350px] lg:min-w-[406px]">

              <RaisedFundProgress ledgerId={ledger_canister_id} projectData={presaleData} />

              <div className="mt-6 w-[40%] flex flex-col justify-around ">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">SALE TYPE</span>
                  <span className="text-lg font-semibold"> PUBLIC </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">UNSOLD TOKENS</span>
                  <span className="text-lg font-semibold  overflow-x-scroll no-scrollbar pr-2">
                    {tokenData ? `${tokenData?.total_supply.toString()} ${tokenData.token_symbol}` : <Skeleton width={120} height={25} />}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">CURRENT RAISED</span>
                  <span className="text-lg font-semibold">
                    {tokenData ? `${tokenData?.fund_raised} ICP` : <Skeleton width={80} height={25} />}
                  </span>
                </div>
              </div>

            </div>
          )}

          {!isMobile && (
            <div className="max-w-[90%] mx-auto lgx:mt-4">
              <div className="flex font-posterama text-[12px] xl:text-[15px]  justify-between">
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

              <RaisedFundProgress ledgerId={ledger_canister_id} projectData={presaleData} />

              <div className="mt-6 w-[40%] flex flex-col justify-around ">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">SALE TYPE</span>
                  <span className="text-lg font-semibold"> PUBLIC </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">UNSOLD TOKENS</span>
                  <span className="text-lg mr-2 overflow-x-scroll no-scrollbar font-semibold">
                    {tokenData ? `${tokenData?.total_supply.toString()} ${tokenData.token_symbol}` : <Skeleton width={120} height={25} />}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">CURRENT RAISED</span>
                  <span className="text-lg font-semibold">
                    {tokenData ? `${tokenData?.fund_raised} ICP` : <Skeleton width={80} height={25} />}
                  </span>
                </div>
              </div>

            </div>
          )}

          {!isMobile && (
            <div className="lg:min-w-[406px] w-full h-[153px] bg-[#FFFFFF1A] rounded-[17.44px] flex flex-col justify-center items-center text-white">

              <div className="text-2xl font-bold"> <SaleStart style={{ text_heading: 'text-lg', text_content: 'text-2xl' }} setTokenPhase={setTokenPhase} presaleData={presaleData && presaleData} /> </div>
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
                <div className="mx-auto flex  items-center justify-center ">
                  <button className="w-full text-white  bg-gradient-to-r from-[#f09787]  to-[#CACCF5] rounded-3xl p-[1.5px] h-[40px] mt-2 ">
                    <div onClick={()=>setPoolDateModalIsOpen(true)} className='flex items-center bg-[#191919] justify-center  w-full h-full  rounded-3xl  '>
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
          {tokenData && <UpdatePoolDate ledgerId={tokenData.canister_id} setRenderComponent={setRenderComponent} PoolDateModalIsOpen={PoolDateModalIsOpen} setPoolDateModalIsOpen={setPoolDateModalIsOpen}  /> }

        </div>
        {isMobile && <MobileViewTab actor={ledgerActor} poolData={tokenData ? tokenData : ''} presaleData={presaleData} />}
      </div>
    </>
  );

};

export default TokenPage;