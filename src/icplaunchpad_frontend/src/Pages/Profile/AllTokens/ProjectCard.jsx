import React, { useEffect, useState } from 'react';
import person1 from '../../../../assets/images/carousel/user.png';
import icp from '../../../../assets/images/icp.png';
import { useNavigate } from 'react-router-dom';
import { useAuths } from '../../../StateManagement/useContext/useClient';
import { useSelector } from 'react-redux';
import { Principal } from '@dfinity/principal';
import { fetchWithRetry } from '../../../utils/fetchWithRetry';
import Skeleton from 'react-loading-skeleton';

const ProjectCard = ({ ledgerID, index }) => {
  const navigate = useNavigate();
  const { createCustomActor } = useAuths();
  const actor = useSelector((currState) => currState.actors.actor);

  const [tokenInfo, setTokenInfo] = useState({});
  const [isFetchingIMG, setFetchingIMG] = useState(false);

  const protocol = process.env.DFX_NETWORK === 'ic' ? 'https' : 'http';
  const domain = process.env.DFX_NETWORK === 'ic' ? 'raw.icp0.io' : 'localhost:4943';
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;

  const handleExportNavigate = async () => {
    console.log('hii', ledgerID)
    try {
      // const ledgerPrincipal = Principal.fromUint8Array(ledgerID);
      console.log(ledgerID.toText())
      const response = await actor.get_sale_params(ledgerID);
      console.log(response)
      if (response.Err)
        navigate("/verify-token", {
          state: { ledger_canister_id: ledgerID.toText() },
        }
        )
      else {
        const routeData = {
          ...({ canister_id: ledgerID.toText() }),
          ...tokenInfo,
        };
        navigate('/token-page', { state: { projectData: routeData } });
      }

    } catch (error) {
      console.error('Error fetching sale params:', error);
    }

  }

// Fetch project data if ledger canister ID is available
useEffect(() => {
  const fetchProjectData = async () => {
    try {
      const ledgerActor = await createCustomActor(ledgerID);
      console.log('ledgerActor', ledgerActor);
      if (!ledgerActor) {
        console.error(`Unable to create ledger actor for ledgerID: ${ledgerID}`);
        return;
      }

      // Fetch token details with retry logic
      const tokenDataResults = await Promise.allSettled([
        fetchWithRetry(() => ledgerActor.icrc1_name(), 3, 1000),
        fetchWithRetry(() => ledgerActor.icrc1_symbol(), 3, 1000),
        fetchWithRetry(() => ledgerActor.icrc1_decimals(), 3, 1000),
        fetchWithRetry(() => ledgerActor.icrc1_total_supply(), 3, 1000),
      ]);

      const token_name = tokenDataResults[0].status === "fulfilled" ? tokenDataResults[0].value : null;
      const token_symbol = tokenDataResults[1].status === "fulfilled" ? tokenDataResults[1].value : null;
      const decimals = tokenDataResults[2].status === "fulfilled" ? tokenDataResults[2].value : null;
      const total_supply = tokenDataResults[3].status === "fulfilled" ? tokenDataResults[3].value : null;

      if (token_name && token_symbol && decimals && total_supply) {
        console.log('total_supply', total_supply);
        setTokenInfo((prev) => ({ ...prev, token_name, token_symbol, decimals, total_supply }));
      } else {
        console.error("Error fetching some token data.");
      }
    } catch (error) {
      console.error(`Error fetching project data for ledgerId: ${ledgerID}`, error);
    }
  };

  if (ledgerID) fetchProjectData();
}, [createCustomActor, ledgerID]);

// Fetch token-specific info if canister ID is available
useEffect(() => {
  const fetchTokenInfo = async () => {
    try {
      if (!actor) {
        console.error('Actor is not available for fetching token info.');
        return;
      }

      // Fetch token images with retry logic
      const tokenImgResults = await Promise.allSettled([
        fetchWithRetry(() => actor.get_token_image_id(ledgerID), 3, 1000),
        fetchWithRetry(() => actor.get_cover_image_id(ledgerID), 3, 1000),
      ]);

      const tokenImgId = tokenImgResults[0].status === "fulfilled" ? tokenImgResults[0].value : null;
      const coverImgId = tokenImgResults[1].status === "fulfilled" ? tokenImgResults[1].value : null;

      if (tokenImgId?.Ok) {
        const imageUrl = `${protocol}://${canisterId}.${domain}/f/${tokenImgId?.Ok}`;
        setTokenInfo((prev) => ({ ...prev, token_image: imageUrl }));
      } else {
        console.warn("Token image ID not found:", tokenImgId);
      }

      if (coverImgId?.Ok) {
        const imageUrl = `${protocol}://${canisterId}.${domain}/f/${coverImgId?.Ok}`;
        setTokenInfo((prev) => ({ ...prev, cover_image: imageUrl }));
      } else {
        console.warn("Cover image ID not found:", coverImgId);
      }

      setFetchingIMG(true);
    } catch (error) {
      console.error('Error fetching token images:', error);
    }
  };

  if (ledgerID) fetchTokenInfo();
}, [actor, ledgerID, canisterId, domain, protocol]);

  return (
    <div onClick={handleExportNavigate}>
      <div
        key={index}
        className=" bg-[#FFFFFF1A] cursor-pointer text-white p-1 pb-4 rounded-xl flex flex-col w-[340px] md:w-[375px] mt-14 mx-0 sm:mx-2"
      >
        {/* Main UI */}
        <div className="h-[240px] rounded-lg py-5 flex flex-col">
          <div className="relative">
            <img
              src={tokenInfo?.token_image || person1}
              className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[50%] rounded-full object-cover h-[100px] w-[100px] md:h-[114px] md:w-[114px]"
              alt="logo"
            />
            <div className="absolute top-[20px] right-[60px] ss2:right-[100px] xxs1:right-[130px] w-10 h-10 rounded-full border-1 border-gray-300">
              <img src={icp} alt="small" className="object-cover w-full h-full" />
            </div>
          </div>
          <div className="mt-[70px] text-center text-white space-y-3">
            <div className="text-[24px] font-semibold">{tokenInfo?.token_name ||  <Skeleton width={80} height={20}/>} </div>
            <div className="text-[16px] text-[#FFFFFFA6] font-medium">TOKEN INFO</div>
          </div>
          <div className="bg-[#FFFFFF66] h-[2px] w-[92%] mx-auto mt-5"></div>
        </div>

        {/* secondary UI */}
        <div className="mb-3 flex flex-wrap gap-4 justify-center">
          <div className="flex flex-col items-center bg-gradient-to-r from-[#1d1e22] via-[#25282d] to-[#1d1e22] rounded-lg p-4 shadow-lg w-[45%]">
            <span className="text-xs text-gray-300 tracking-wide">TOKEN SYMBOL</span>
            <span className="text-lg font-bold text-gradient bg-gradient-to-r from-[#f09787] to-[#CACCF5] text-transparent bg-clip-text">
              {tokenInfo?.token_symbol ||  <Skeleton width={50} height={15}/>}
            </span>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-r from-[#1d1e22] via-[#25282d] to-[#1d1e22] rounded-lg p-4 shadow-lg w-[45%]">
            <span className="text-xs text-gray-300 tracking-wide">DECIMALS</span>
            <span className="text-lg font-bold text-white">
              {tokenInfo?.decimals ||  <Skeleton width={30} height={15}/> }
            </span>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-r from-[#1d1e22] via-[#25282d] to-[#1d1e22] rounded-lg p-4 shadow-lg w-[90%]">
            <span className="text-xs text-gray-300 tracking-wide">TOTAL SUPPLY</span>
            <span className="text-lg font-bold text-white">
              {Number(tokenInfo?.total_supply) ||  <Skeleton width={100} height={15}/> }
            </span>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ProjectCard;
