import React, { useState, useEffect } from "react";
import ProjectRectangleBg from "../../../assets/images/project-rectangle-bg.png";
import { FaFacebook, FaTwitter, FaDiscord } from "react-icons/fa";
import { IoGlobeOutline } from "react-icons/io5";
import { FaTelegram } from "react-icons/fa6";
import { toast, Toaster } from "react-hot-toast";
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
import ApproveOrRejectModal from "../../components/Modals/ApproveOrRejectModal.jsx";
import Skeleton from "react-loading-skeleton";
import TokenTransactions from "../../common/TokenTransactions/TokenTransactions";
import { useSelector } from "react-redux";

const TokenPage = () => {
  const [tokenPhase, setTokenPhase] = useState("");
  const [activeTab, setActiveTab] = useState("About");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const location = useLocation();
  const { projectData } = location.state || {};
  const { createCustomActor, principal, signerId } = useAuths();
  const [saleParams, setSaleParams] = useState(null);
  const [ledgerActor, setLedgerActor] = useState(null);
  const [tokenOwnerInfo, setTokenOwnerInfo] = useState(null);
  const [ModalIsOpen, setModalIsOpen] = useState(false);
  const [err, setErr] = useState("");

  const actor = useSelector((currState) => currState.actors.actor);
 

  console.log("baclance at 35", tokenOwnerInfo)
  const [amount, setAmount] = useState(0);
  console.log("amount")
  const authenticatedAgent = useAgent()
  console.log("agent project", authenticatedAgent)
  const [isLoading, setIsLoading] = useState(false);

  // Utility function for retrying API calls
  const fetchWithRetry = async (fetchFunction, retries, delay) => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await fetchFunction();
      } catch (error) {
        attempt++;
        console.warn(`Attempt ${attempt} failed. Retrying...`, error);
        if (attempt >= retries) {
          throw new Error(`Failed after ${retries} retries: ${error.message}`);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  // Main useEffect for fetching data
  useEffect(() => {
    const fetchTokenData = async () => {
      if (projectData?.canister_id) {
        console.log("projectData=>", projectData);
        try {
          const ledgerPrincipal = Principal.fromText(projectData.canister_id);

          // Fetch fund raised
          if (ledgerPrincipal) {
            const fundRaised = await actor.get_funds_raised(ledgerPrincipal)
            console.log('fundRaised==', fundRaised)

            setTokenOwnerInfo({
              fund_raised: fundRaised?.Ok.toString() || '0',
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
          console.log("ledger id >>>>", projectData.canister_id);
          const ledgerPrincipal = Principal.fromText(projectData.canister_id);

          const ledgerActor = await createCustomActor(ledgerPrincipal);
          setLedgerActor(ledgerActor)

          // Fetch sale parameters with retry logic
          const sale = await fetchWithRetry(
            () => actor.get_sale_params(ledgerPrincipal),
            3,
            1000
          );

          console.log("SALE=>>>", sale);

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
  }, [projectData?.canister_id, actor]);


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
      case "Transactions":
        return <TokenTransactions actor={ledgerActor} />;
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
    "Transactions",
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


  const handleTokenPurchase = async (actor, buyerDetails, sellArgs) => {
    const purchaseResponse = await actor?.buy_tokens(buyerDetails);
    console.log("Token Purchase Response:", purchaseResponse);

    if (purchaseResponse?.Ok) {
      toast.success("Token purchase successful!");

      const sellResponse = await actor?.sell_tokens(sellArgs);
      console.log("Sell Tokens Response:", sellResponse);

      if (sellResponse?.Ok) {
        toast.success("Sell transaction successful!");
      } else {
        throw new Error(`Sell transaction failed: ${sellResponse.Err}`);
      }
    } else {
      throw new Error(`Buy tokens failed: ${purchaseResponse.Err}`);
    }
  };

  const handleTransaction = async () => {
    if (!amount || amount <= 0) {
      toast.error("Invalid amount. Please enter a valid value.");
      return;
    }

    if (!projectData?.canister_id) {
      toast.error("Missing required project data to process the transaction.");
      console.log("Project Canister ID is missing:", projectData?.canister_id);
      return;
    }

    const totalAmount = BigInt(amount * 10 ** 8);
    const nowInMicroseconds = BigInt(Date.now()) * 1000n;
    const expiresAtTimeInMicroseconds = nowInMicroseconds + BigInt(10 * 60 * 1_000_000); // 10 minutes later
    const creationTimeInMicroseconds = nowInMicroseconds;

    const spender = {
      owner: Principal.fromText(process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND),
      subaccount: [],
    };

    const icrc2ApproveArgs = {
      from_subaccount: [],
      spender,
      fee: [],
      memo: [],
      amount: totalAmount + BigInt(100000),
      created_at_time: [creationTimeInMicroseconds],
      expected_allowance: [expiresAtTimeInMicroseconds],
      expires_at: [],
    };

    const buyerDetails = {
      buyer_principal: Principal.fromText(principal),
      tokens: totalAmount,
      icrc1_ledger_canister_id: Principal.fromText(projectData?.canister_id),
    };

    const sellArgs = {
      tokens: totalAmount,
      to_principal: Principal.fromText(principal),
      token_ledger_canister_id: projectData?.canister_id,
    };

    setIsLoading(true);

    try {
      if (process.env.DFX_NETWORK !== "ic") {
        console.log("Processing transaction on local network...");

        if (signerId === "Plug") {
          console.log("Using Plug wallet...");
          console.log("ICRC2 Approve Args:", icrc2ApproveArgs);

          const approvalResponse = await ledgerActor?.icrc2_approve(icrc2ApproveArgs);
          console.log("Approval Response:", approvalResponse);

          if (approvalResponse?.Ok) {
            await handleTokenPurchase(actor, buyerDetails, sellArgs);
          } else {
            throw new Error(`Approval failed: ${approvalResponse.Err}`);
          }
        } else {
          console.log("Processing transaction without Plug wallet...");
          await handleTokenPurchase(actor, buyerDetails, sellArgs);
        }
      } else {
        console.log("Processing transaction on mainnet...");
        console.log("ICRC2 Approve Args:", icrc2ApproveArgs);

        const approvalResponse = await ledgerActor?.icrc2_approve(icrc2ApproveArgs);
        console.log("Approval Response:", approvalResponse);

        if (approvalResponse?.Ok) {
          await handleTokenPurchase(actor, buyerDetails, sellArgs);
        } else {
          throw new Error(`Approval failed: ${approvalResponse.Err}`);
        }
      }
    } catch (error) {
      console.error("Error during transaction processing:", error);
      toast.error("Payment process failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  console.log('cover', projectData.cover_image)

  return (
    <>
      <div className="flex flex-col  gap-5 max-w-[95%] mx-auto lg:flex-row">
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
                  src={projectData.token_image || person1} // Show person1 as a fallback if tokenImg is not available yet
                  className="absolute  top-0 left-[50%] transform -translate-x-1/2 -translate-y-[35%] rounded-full object-cover   h-[130px] w-[130px]"
                  alt="Profile Picture"
                  draggable="false"
                />
                
              </div>
              <div className="content-div font-posterama flex justify-between w-[90%] m-auto mt-7 ">
                <div className="left flex flex-col gap-4">
                  <div className="text-[24px]"> {projectData ? projectData?.token_name : <Skeleton width={80} height={20} />} </div>
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
                          <FaTelegram className="size-6" />
                          <FaDiscord className="size-6" />
                        </>
                    }
                  </div>
                </div>
                <div className="right flex flex-col text-[17px] mr-8 lgx:mr-0 gap-4">
                  <div className="text-[#FFC145]"> {tokenPhase ? tokenPhase : <Skeleton width={80} height={20} />} </div>
                  <div>{saleParams ? `Softcap ${saleParams?.softcap} ICP` : <Skeleton width={100} height={20} />}</div>
                </div>
              </div>
              <div className="bg-[#FFFFFF66] h-[2px] max-w-[90%] mx-auto mt-4"></div>
            </div>
          )}

          {isMobile && (
            <div className="h-[314px] bg-[#181818] rounded-lg py-5 flex flex-col">
              <div className="relative">
                <img
                   src={projectData.token_image || person1}
                  className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[50%] object-cover rounded-full h-[130px] w-[130px] md:min-h-[177px] md:min-w-[177px]"
                  alt=""
                />
              </div>

              <div className="mt-[70px] font-posterama text-center text-white space-y-2">
                <div className=" text-[24px] font-bold"> {projectData ? projectData?.token_name : <Skeleton width={80} height={20} />}</div>
                <div className=" text-[16px] font-medium">
                  Fair Launch
                </div>
                <div className="text-[#FFC145] text-[18px] font-semibold">
                  {tokenPhase ? tokenPhase : <Skeleton width={80} height={20} />}
                </div>
                <div className="text-[16px]"> {saleParams ? `Softcap ${saleParams?.softcap} ICP` : <Skeleton width={140} height={20} />} </div>
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
                      <FaTelegram className="size-6" />
                      <FaDiscord className="size-6" />
                    </>
                }
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
              className="no-spinner w-full p-2 rounded-md bg-[#333333] border-none text-white text-base mb-2"
              placeholder={projectData ? "Enter Amount in ICP" : ""}
              onKeyDown={(e) => {
                if (['-', 'e', '+'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                setErr("");
                const value = parseFloat(e.target.value);

                if (isNaN(value) || value === "") {
                  setErr("Please enter a valid amount.");
                  return;
                }

                if (value <= 0) {

                  setErr(value === 0 ? "You can't contribute 0 ICP" : "Invalid amount.");
                  return;
                }

                handleAmount(e); // Call your handler
              }}
              min="0"
            />


            <h1 className="text-red-600 font-medium mb-4">{err}</h1>

            <button
              disabled={tokenPhase !== "ONGOING" || err}
              onClick={() => (amount > 0) && setModalIsOpen(true)}
              className={`w-[50%] p-2 rounded-2xl font-semibold text-black text-base 
    ${tokenPhase !== "ONGOING" ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-[#f3b3a7] to-[#cac9f5] hover:opacity-90"}`}
            >
              USE ICP
            </button>

            <div>
              {ModalIsOpen && <ApproveOrRejectModal handleAction={handleTransaction} ModalIsOpen={ModalIsOpen} setModalIsOpen={setModalIsOpen} amount={amount} ledgerPrincipal={projectData.canister_id} />}
            </div>

          </div>

          <div className="bg-[#FFFFFF1A] text-white p-1 rounded-lg flex flex-col ss2:flex-row    w-full lg:min-w-[406px]">

            <RaisedFundProgress ledgerId={projectData?.canister_id} projectData={saleParams} />

            <div className="mt-6 w-[40%] gap-4 sxs3:gap-8 px-2 relative  flex ss2:flex-col  justify-around ">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">SALE TYPE</span>
                <span className="text-lg font-semibold">{saleType}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">UNSOLD TOKENS</span>
                <span className="text-lg font-semibold overflow-x-scroll no-scrollbar">
                  {projectData ? ` ${projectData.total_supply && projectData.total_supply.toString()} ${projectData.token_symbol}` : <Skeleton width={80} height={20} />}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">CURRENT RAISED</span>
                <span className="text-lg font-semibold">
                  {tokenOwnerInfo ? `${tokenOwnerInfo.fund_raised} ICP` : <Skeleton width={60} height={20} />}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:min-w-[406px] w-full h-[153px] bg-[#FFFFFF1A] rounded-[17.44px] flex flex-col justify-center items-center text-white">
            <SaleStart style={{ text_heading: 'text-lg', text_content: 'text-2xl' }} setTokenPhase={setTokenPhase} presaleData={saleParams} />
          </div>
        </div>
        {isMobile && <MobileViewTab actor={ledgerActor} ledgerId={projectData?.canister_id}
          presaleData={saleParams} poolData={projectData ? { ...projectData, total_supply: projectData?.total_supply } : {}}
        />}
      </div>
      <Toaster />
    </>
  );
};

export default TokenPage;