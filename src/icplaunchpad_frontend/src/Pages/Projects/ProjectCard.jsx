import React, { useEffect, useState } from 'react';
import person1 from '../../../assets/images/carousel/person1.png';
import l3 from '../../../assets/images/carousel/l3.png';
import { useNavigate } from 'react-router-dom';
import { Principal } from '@dfinity/principal';
import SaleStart from '../OwnerSection/SaleStart';
import { useAuth } from '../../StateManagement/useContext/useClient';

const ProjectCard = ({ isUserToken, projectData, saleType, index }) => {
  const navigate = useNavigate();
  const { createCustomActor, actor } = useAuth();
  const [tokenInfo, setTokenInfo] = useState({});
  const [isFetchingIMG, setFetchingIMG] = useState(false);
  const [tokenPhase, setTokenPhase] = useState("UPCOMING");
  const [saleProgress, setSaleProgress] = useState(0);
  const [ledgerActor, setLedgerActor] = useState();

  const protocol = process.env.DFX_NETWORK === 'ic' ? 'https' : 'http';
  const domain = process.env.DFX_NETWORK === 'ic' ? 'raw.icp0.io' : 'localhost:4943';
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const ledgerId = projectData.ledger_canister_id || projectData.canister_id;

  // Calculate sale progress based on the token phase and supply
  useEffect(() => {
    if (tokenPhase === "UPCOMING") {
      setSaleProgress(0);
    } else if (tokenPhase === "SUCCESSFULL") {
      setSaleProgress(100);
    } else if (tokenInfo.total_supply && projectData.total_supply) {
      const progress = 100 - (Number(tokenInfo.total_supply) / Number(projectData.total_supply)) * 100;
      setSaleProgress(progress.toFixed(2));
    }
  }, [tokenPhase, tokenInfo.total_supply, projectData.total_supply]);

  // Fetch ledger actor and initial token owner information
  useEffect(() => {
    const fetchTokenOwnerInfo = async () => {
      try {
        const createdActor = await createCustomActor(ledgerId);
        setLedgerActor(createdActor);

        const owner = await createdActor.icrc1_minting_account();
        if (owner) {
          const ownerBalance = await createdActor.icrc1_balance_of(owner[0]);
          setTokenInfo((prev) => ({
            ...prev,
            owner_bal: ownerBalance.toString(),
            owner: owner[0].owner.toString(),
          }));
        }
      } catch (error) {
        console.error("Error fetching token owner info:", error);
      }
    };
    if (ledgerId) fetchTokenOwnerInfo();
  }, [createCustomActor, ledgerId]);

  // Fetch project data if ledger canister ID is available
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!ledgerActor) return;

      try {
        const [token_name, total_supply, token_symbol] = await Promise.all([
          ledgerActor.icrc1_name(),
          ledgerActor.icrc1_total_supply(),
          ledgerActor.icrc1_symbol(),
        ]);

        setTokenInfo((prev) => ({ ...prev, token_name, total_supply, token_symbol }));

        const ledgerPrincipal = Principal.fromText(ledgerId);
        const [tokenImgId, coverImgId] = await Promise.all([
          actor.get_token_image_id(ledgerPrincipal),
          actor.get_cover_image_id(ledgerPrincipal),
        ]);

        if (tokenImgId?.length) {
          const imageUrl = `${protocol}://${canisterId}.${domain}/f/${tokenImgId[tokenImgId.length - 1]}`;
          setTokenInfo((prev) => ({ ...prev, token_image: imageUrl }));
        }
        if (coverImgId?.length) {
          const imageUrl = `${protocol}://${canisterId}.${domain}/f/${coverImgId[coverImgId.length - 1]}`;
          setTokenInfo((prev) => ({ ...prev, cover_image: imageUrl }));
        }
        setFetchingIMG(true);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };
    if (ledgerId) fetchProjectData();
  }, [actor, ledgerActor, ledgerId, canisterId, domain, protocol]);

  // Fetch token-specific info if canister ID is available
  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        const ledgerPrincipal = Principal.fromText(projectData.canister_id);
        const saleParams = await actor.get_sale_params(ledgerPrincipal);

        setTokenInfo((prev) => ({ ...prev, sale_Params: saleParams.Ok }));

        const [tokenImgId, coverImgId] = await Promise.all([
          actor.get_token_image_id(ledgerPrincipal),
          actor.get_cover_image_id(ledgerPrincipal),
        ]);

        if (tokenImgId?.length) {
          const imageUrl = `${protocol}://${canisterId}.${domain}/f/${tokenImgId[tokenImgId.length - 1]}`;
          setTokenInfo((prev) => ({ ...prev, token_image: imageUrl }));
        }
        if (coverImgId?.length) {
          const imageUrl = `${protocol}://${canisterId}.${domain}/f/${coverImgId[coverImgId.length - 1]}`;
          setTokenInfo((prev) => ({ ...prev, cover_image: imageUrl }));
        }
        setFetchingIMG(true);
      } catch (error) {
        console.error("Error fetching token info:", error);
      }
    };
    if (projectData.canister_id) fetchTokenInfo();
  }, [actor, projectData.canister_id, canisterId, domain, protocol]);

  // Handle navigation based on the token or project data
  const handleViewMoreClick = () => {
    if (isFetchingIMG) {
      const routeData = {
        ...(projectData.ledger_canister_id ? { canister_id: projectData.ledger_canister_id } : {}),
        ...projectData,
        ...tokenInfo,
        saleProgress,
      };
      navigate(isUserToken ? "/token-page" : "/project", { state: { projectData: routeData } });
    }
  };
  return (
    <div>
      <div
        key={index}
        onClick={handleViewMoreClick}
        className="bg-[#FFFFFF1A] cursor-pointer text-white p-1 rounded-xl flex flex-col ss2:w-[325px] xxs1:w-[400px] mt-14 mx-2"
      >
        <div className="h-[280px] rounded-lg py-5 flex flex-col">
          <div className="relative">
            <img
              src={tokenInfo?.token_image || person1}
              className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[50%] rounded-full object-cover h-[100px] w-[100px] md:h-[114px] md:w-[114px]"
              alt="logo"
            />
            <div className="absolute top-[20px] right-[60px] ss2:right-[100px] xxs1:right-[130px] w-10 h-10 rounded-full border-1 border-gray-300">
              <img src={l3} alt="small" className="object-cover w-full h-full" />
            </div>
          </div>
          <div className="mt-[70px] text-center text-white space-y-5">
            <div className="text-[24px] font-semibold">{projectData?.token_name || tokenInfo?.token_name}</div>
            <div className="text-[16px] text-[#FFFFFFA6] font-medium">FAIR LAUNCH - MAX BUY 5 SOL</div>

            <div className="text-[#FFC145] text-[18px] font-normal"> {tokenPhase} </div>
          </div>
          <div className="bg-[#FFFFFF66] h-[2px] w-[92%] mx-auto mt-6"></div>
        </div>
        <div className="flex">
          <div className="relative flex items-center overflow-hidden w-[60%] h-72">
            <div className="absolute left-[-110%] ss2:left-[-62%] xxs1:left-[-30%] sm:left-[-20%] md:left-[-45%] top-0 w-72 h-72">
            <svg style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#f3b3a7', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#cac9f5', stopOpacity: 1 }} />
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
                  strokeDasharray={`${saleProgress}, 100`}
                />
              </svg>
              <div className="absolute ml-28 ss2:ml-10 inset-0 flex flex-col items-center justify-center">
                <span>Progress</span>
                <span className="text-lg font-semibold text-white">
                  {saleProgress}%
                </span>
                <span className="text-sm text-gray-400 mt-1">{tokenInfo ? tokenInfo.owner_bal : 0} ICP RAISED</span>
              </div>
            </div>
          </div>
          <div className="mt-6 w-[40%] flex flex-col justify-around">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">HARD</span>
              <span className="text-lg font-semibold bg-gradient-to-r from-[#f09787] to-[#CACCF5] text-transparent bg-clip-text">{"200 ETH"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Liquidity</span>
              <span className="text-lg font-semibold">{"51%"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Lock Time</span>
              <span className="text-lg font-semibold">{"365 DAYS"}</span>
            </div>
            <div className="flex flex-col">

              {tokenInfo && <SaleStart style={{ text_heading: 'text-sm', text_content: 'text-lg' }} setTokenPhase={setTokenPhase} presaleData={projectData?.sale_details || tokenInfo?.sale_Params} />}
            </div>
            <button onClick={handleViewMoreClick} className="border-b-2 border-r-gray-600 w-20 cursor-pointer">View More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
