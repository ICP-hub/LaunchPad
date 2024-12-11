import React, { useState, useEffect } from "react";
import ProjectRectangleBg from "../../../assets/images/project-rectangle-bg.png";
import { FaFacebook, FaTwitter, FaReddit, FaInstagram, FaDiscord } from "react-icons/fa";
import { IoGlobeOutline } from "react-icons/io5";
import { FaTelegram } from "react-icons/fa6";
import { toast, Toaster } from "react-hot-toast";
import { idlFactory  } from "../../StateManagement/useContext/ledger.did.js";

import person1 from "../../../assets/images/carousel/user.png";
import ProjectTokenAbout from "./about/ProjectTokenAbout.jsx";
import FAQsDiscussion from "./FAQsDiscussion/FAQsDiscussion.jsx";
import Pooolinfo from "./pooolinfo/Pooolinfo.jsx";
import Token from "./token/Token.jsx";
import Tokenomic from "./Tokenomic/Tokenomic.jsx";
import MobileViewTab from "./MobileViewTab.jsx";
import { useLocation } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import SaleStart from "../OwnerSection/SaleStart.jsx";
import { getSocialLogo } from "../../common/getSocialLogo.jsx";
import { useAuths } from "../../StateManagement/useContext/useClient.jsx";
import { useAgent, useIdentityKit } from "@nfid/identitykit/react";
import { Actor } from "@dfinity/agent";
import RaisedFundProgress from "../../common/RaisedFundProgress.jsx";
import ApproveOrRejectModal from "../../common/ApproveOrRejectModal.jsx";

const TokenPage = () => {
  const [tokenPhase, setTokenPhase] = useState("UPCOMING");
  const [activeTab, setActiveTab] = useState("About");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const location = useLocation();
  const { projectData } = location.state || {};
  const { actor, createCustomActor, principal } = useAuths();
  const [saleParams, setSaleParams] = useState(null);
  const [ledgerActor, setLedgerActor] = useState(null);
  const [tokenOwnerInfo, setTokenOwnerInfo] = useState(null);
  const [ModalIsOpen, setModalIsOpen] = useState(false);
  console.log("baclance at 35",tokenOwnerInfo)
  const [amount, setAmount] = useState(0);
  console.log("amount")
  const authenticatedAgent = useAgent()
  console.log("agent project", authenticatedAgent)
  const [isLoading, setIsLoading] = useState(false); 
  
  useEffect(() => {
    const fetchTokenData = async () => {
      if (projectData?.canister_id) {
        console.log("projectData=>", projectData)
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
          console.log("ledger id >>>>", projectData.canister_id)
          const ledgerPrincipal = Principal.fromText(projectData.canister_id);
          const sale = await actor.get_sale_params(ledgerPrincipal);
          console.log('SALE=>>>', sale)
          if (sale?.Ok) {

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
      setAmount(val);
    }
  };

console.log("ledger actor ", ledgerActor)

  const handleTransaction = async () => {
    if (!amount || amount <= 0) {
      toast.error("Invalid amount. Please enter a valid value.");
      return;
    }

    if ( !projectData?.canister_id) {
      toast.error("Missing required data to process the transaction.");
      console.log(" authenticprojectData?.canister_idatedAgent 188", projectData?.canister_id)
      return;
    }   
    setIsLoading(true);

    const acc = {
      owner: Principal.fromText(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND),
      subaccount: [],
    };

    console.log('dh', BigInt(amount * 10 ** 8 + 100000))
    const icrc2_approve_args = {
      from_subaccount: [],
      spender: acc,
      fee: [],
      memo: [],
      amount: BigInt(amount * 10 ** 8 + 100000),
      created_at_time: [],
      expected_allowance: [],
      expires_at: [],
    };
    console.log("icrc2_approve_args icrc2_approve_args 201:", icrc2_approve_args);
    const totalamount = BigInt(amount * 10 ** 8);
 
    console.log("Total amount:", totalamount);
    try {
      const response = await ledgerActor.icrc2_approve(icrc2_approve_args);
      console.log("Response from payment approve", response);

      if (response.Ok) {
       const byer = {
         buyer_principal: Principal.fromText(principal),
         tokens: totalamount,
         icrc1_ledger_canister_id: Principal.fromText(projectData?.canister_id),
       }
        const finalOrderResponse = await actor.buy_tokens(byer);
        console.log("Final Order Response", finalOrderResponse);
        toast.success("Transaction successful!");

        if (finalOrderResponse?.Ok) {
          toast.success("Token purchase successful!");

          const sellArgs = {
            tokens: totalamount,
            to_principal: Principal.fromText(principal),
            token_ledger_canister_id: projectData?.canister_id,
          };

          const sellResponse = await actor.sell_tokens(sellArgs);
          console.log("Sell Tokens Response:", sellResponse);

          if (sellResponse?.Ok) {
            toast.success("Sell transaction successful!");
          } else {
            console.error("Sell transaction failed:", sellResponse);
            toast.error("Sell transaction failed. Please try again.");
          }
        } else {
          console.error("Buy tokens failed:", finalOrderResponse);
          toast.error("Token purchase failed. Please try again.");
        }
        
      } else {
        console.error("Approval failed", response);
        toast.error("Payment approval failed. Please check your wallet balance.");
      }
    } catch (err) {
      console.error("Error during payment approval or token purchase", err);
      toast.error("Payment process failed. Please try again.");
    } finally {
      setIsLoading(false); 
    }
  
  };
  console.log('cover',projectData.cover_image)
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
                  <div>Fair Launch</div>
                  <div className="logos flex  gap-11">
                    {
                      (saleParams && saleParams.social_links.length > 0) ?
                        saleParams.social_links.map((link, index) => {
                          console.log('link=', link)
                          return <a href={link} target="blank" key={index}> {getSocialLogo(link)} </a>
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
                  <div>{`Soft ${saleParams?.softcap} ICP`}</div>
                </div>
              </div>
              <div className="bg-[#FFFFFF66] h-[2px] max-w-[90%] mx-auto mt-4"></div>
            </div>
          )}

          {isMobile && (
            <div className="h-[314px] bg-[#181818] rounded-lg py-5 flex flex-col">
              <div className="relative">
                <img
                  src={projectData ? projectData.token_image : person1}
                  className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[50%] object-cover rounded-full h-[130px] w-[130px] md:min-h-[177px] md:min-w-[177px]"
                  alt=""
                />
              </div>

              <div className="mt-[70px] font-posterama text-center text-white space-y-2">
                <div className=" text-[24px] font-bold"> {projectData && projectData?.token_name}</div>
                <div className=" text-[16px] font-medium">
                 Fair Launch
                </div>
                <div className="text-[#FFC145] text-[18px] font-semibold">
                {tokenPhase}
                </div>
                <div className="text-[16px]"> {`Soft ${saleParams?.softcap} ICP`} </div>
              </div>

              <div className="bg-[#FFFFFF66] h-[2px] w-[100%] mx-auto mt-4"></div>

              <div className="flex justify-center gap-4  dxs:gap-9 text-[23px] w-[100%] mt-4">
                {
                  (saleParams && saleParams.social_links.length > 0) ?
                    saleParams.social_links.map((link, index) => {
                      console.log('link=', link)
                      return <a href={link} key={index} target="blank" > {getSocialLogo(link)} </a>
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
              <div className="flex font-posterama text-[12px] xl:text-[15px]  justify-between">
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
              disabled={tokenPhase !== "ONGOING"}
              className=" no-spinner w-full p-2 rounded-md bg-[#333333] border-none text-white text-base mb-5"
              placeholder={projectData && `Enter Amount in ICP`}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e' || e.key === '+') {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const value = e.target.value;
                if (value < 0) {
                  e.target.value = 0; // Reset to 0 if negative value is entered programmatically
                }
                handleAmount(e); // Call your handler
              }}
              min="0"
            />

            {/* token amount per icp */}
          

            <button onClick={()=>(amount > 0) && setModalIsOpen(true)} className="w-[50%] p-2 rounded-2xl   font-semibold  bg-gradient-to-r from-[#f3b3a7] to-[#cac9f5] text-black text-base">
              USE ICP
            </button>
            <div>
           {ModalIsOpen && <ApproveOrRejectModal handleAction={handleTransaction} ModalIsOpen={ModalIsOpen} setModalIsOpen={setModalIsOpen} amount={amount} ledgerPrincipal={projectData.canister_id} /> }
            </div>
            
          </div>

          <div className="bg-[#FFFFFF1A] text-white p-1 rounded-lg flex flex-col ss2:flex-row    w-full lg:min-w-[406px]">
            
          <RaisedFundProgress ledgerId={projectData?.canister_id} projectData={saleParams}/>

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
      <Toaster />
    </>
  );
};

export default TokenPage;