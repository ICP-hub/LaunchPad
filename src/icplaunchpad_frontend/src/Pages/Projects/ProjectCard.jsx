import React, { useEffect, useState } from 'react';
import person1 from '../../../assets/images/carousel/user.png';
import l3 from '../../../assets/images/carousel/l3.png';
import icp from "../../../assets/images/icp.png"
import { useNavigate } from 'react-router-dom';
import { Principal } from '@dfinity/principal';
import SaleStart from '../OwnerSection/SaleStart';
import { useAuths } from '../../StateManagement/useContext/useClient';
import { useSelector } from 'react-redux';
import RaisedFundProgress from '../../common/RaisedFundProgress';
import { fetchWithRetry } from '../../utils/fetchWithRetry';
import Skeleton from 'react-loading-skeleton';

const ProjectCard = ({ isUserToken, projectData, initial_Total_supply, saleType, index }) => {
  const navigate = useNavigate();
  const { createCustomActor } = useAuths();
  const actor = useSelector((currState) => currState.actors.actor);

  const [tokenInfo, setTokenInfo] = useState({});
  const [isFetchingIMG, setFetchingIMG] = useState(false);
  const [tokenPhase, setTokenPhase] = useState('UPCOMING');
  const [fundRaised, setfundRaised] = useState(0);
  const [fundRaisedProgress, setfundRaisedProgress] = useState(0);
  const [progressType, setProgressType] = useState();
  const [ledgerActor, setLedgerActor] = useState();
  const principal = useSelector((currState) => currState.internet.principal);

  const protocol = process.env.DFX_NETWORK === 'ic' ? 'https' : 'http';
  const domain = process.env.DFX_NETWORK === 'ic' ? 'raw.icp0.io' : 'localhost:4943';
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const ledgerId = projectData.ledger_canister_id || projectData.canister_id;

  // Fetch ledger actor and initial token owner information
useEffect(() => {
  const fetchTokenOwnerInfo = async () => {
    try {
      const createdActor = await fetchWithRetry(() => createCustomActor(ledgerId), 3, 1000);
      setLedgerActor(createdActor);

         // Fetch fund raised
         if (ledgerId) {
            const ledgerPrincipal= typeof ledgerId === "string"
                    ? Principal.fromText(ledgerId)
                    : ledgerId;
          console.log('ledgerid',ledgerId)
          const fundRaised = await actor.get_funds_raised(ledgerPrincipal)
          console.log('fundRaised==',fundRaised)

        setTokenInfo((prev) => ({
          ...prev,
          fund_raised: fundRaised?.Ok.toString() || '0',
        }));
      }
    } catch (error) {
      console.error(`Error fetching token funds raised for ledgerId: ${ledgerId}`, error);
    }
  };

  if (ledgerId) fetchTokenOwnerInfo();
}, [createCustomActor, ledgerId]);

// Fetch project data if ledger canister ID is available
useEffect(() => {
  const fetchProjectData = async () => {
    if (!ledgerActor) return;

    try {
      const [token_name, total_supply, token_symbol] = await Promise.allSettled([
        fetchWithRetry(() => ledgerActor.icrc1_name(), 3, 1000),
        fetchWithRetry(() => ledgerActor.icrc1_total_supply(), 3, 1000),
        fetchWithRetry(() => ledgerActor.icrc1_symbol(), 3, 1000),
      ]);

      setTokenInfo((prev) => ({
        ...prev,
        token_name: token_name.status === "fulfilled" ? token_name.value : null,
        total_supply: total_supply.status === "fulfilled" ? total_supply.value : null,
        token_symbol: token_symbol.status === "fulfilled" ? token_symbol.value : null,
      }));

      const ledgerPrincipal = Principal.fromText(ledgerId);
      const [tokenImgId, coverImgId] = await Promise.allSettled([
        fetchWithRetry(() => actor.get_token_image_id(ledgerPrincipal), 3, 1000),
        fetchWithRetry(() => actor.get_cover_image_id(ledgerPrincipal), 3, 1000),
      ]);

      if (tokenImgId.status === "fulfilled" && tokenImgId.value?.Ok) {
        const imageUrl = `${protocol}://${canisterId}.${domain}/f/${tokenImgId.value?.Ok}`;
        setTokenInfo((prev) => ({ ...prev, token_image: imageUrl }));
      }
      if (coverImgId.status === "fulfilled" && coverImgId.value?.Ok) {
        const imageUrl = `${protocol}://${canisterId}.${domain}/f/${coverImgId.value?.Ok}`;
        setTokenInfo((prev) => ({ ...prev, cover_image: imageUrl }));
      }
      setFetchingIMG(true);
    } catch (error) {
      console.error(`Error fetching project data for ledgerId: ${ledgerId}`, error);
    }
  };

  if (ledgerId) fetchProjectData();
}, [actor, ledgerActor, ledgerId, canisterId, domain, protocol]);

  // Fetch token-specific info if canister ID is available
  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        if (ledgerActor && projectData?.token_name === "Imported") {
          const token_name = await ledgerActor.icrc1_name();
          setTokenInfo((prev) => ({ ...prev, token_name }));
        }
        else {
          setTokenInfo((prev) => ({ ...prev, token_name: projectData?.token_name }));
        }

        const ledgerPrincipal = Principal.fromText(ledgerId);
        const saleParams = await actor.get_sale_params(ledgerPrincipal);

      setTokenInfo((prev) => ({ ...prev, sale_Params: saleParams?.Ok }));

      const [tokenImgId, coverImgId] = await Promise.allSettled([
        fetchWithRetry(() => actor.get_token_image_id(ledgerPrincipal), 3, 1000),
        fetchWithRetry(() => actor.get_cover_image_id(ledgerPrincipal), 3, 1000),
      ]);

        if (tokenImgId?.Ok) {
          const imageUrl = `${protocol}://${canisterId}.${domain}/f/${tokenImgId?.Ok}`;
          setTokenInfo((prev) => ({ ...prev, token_image: imageUrl }));
        }

        if (coverImgId?.Ok) {
          const imageUrl = `${protocol}://${canisterId}.${domain}/f/${coverImgId?.Ok}`;
          setTokenInfo((prev) => ({ ...prev, cover_image: imageUrl }));
        }
        setFetchingIMG(true);
      } catch (error) {
        console.error(`Error fetching token info for canisterId: ${projectData.canister_id}`, error);
      }
    };
    if (projectData.canister_id) fetchTokenInfo();
  }, [actor, ledgerId, domain, protocol]);

  // Handle navigation based on the token or project data
  const handleViewMoreClick = () => {
    if (isFetchingIMG) {
      const routeData = {
        ...(projectData.ledger_canister_id ? { canister_id: projectData.ledger_canister_id } : {}),
        ...projectData,
        ...tokenInfo,
        fundRaisedProgress,
      };
      console.log('routeData=>', routeData)
      const creator = routeData?.sale_details?.creator || routeData?.sale_Params?.creator;
      navigate(isUserToken || creator == principal ? '/token-page' : '/project', { state: { projectData: routeData } });
    }
  };

  return (
    // (isUserToken && !tokenInfo.sale_Params) ?
    //   <> </>
    //   : 
    <div>
      <div
        key={index}
        onClick={handleViewMoreClick}
        className="bg-[#FFFFFF1A] cursor-pointer text-white p-1 pb-4 rounded-xl flex flex-col w-[340px] md:w-[375px] mt-14 mx-0 sm:mx-2"
      >
        {/* Main UI */}
        <div className="h-[250px] rounded-lg py-5 flex flex-col">
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
            <div className="text-[24px] font-semibold">
              {tokenInfo ? tokenInfo?.token_name : <Skeleton width={80} height={20} />}
            </div>
            <div className="text-[16px] text-[#FFFFFFA6] font-medium">Fair Launch</div>
            <div className="text-[#FFC145] text-[18px] font-normal">{tokenPhase}</div>
          </div>
          <div className="bg-[#FFFFFF66] h-[2px] w-[92%] mx-auto mt-5"></div>
        </div>

        <div className="flex">

          <RaisedFundProgress comp='card' ledgerId={ledgerId} projectData={projectData?.sale_details} tokenInfo={tokenInfo} />

          <div className="mt-6 w-[40%] flex flex-col justify-around">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">HARD</span>
              <span className="text-lg font-semibold bg-gradient-to-r overflow-x-scroll no-scrollbar from-[#f09787] to-[#CACCF5] text-transparent bg-clip-text">
                {projectData?.sale_details?.hardcap || tokenInfo?.sale_Params?.hardcap
                  ? `${Number(projectData?.sale_details?.hardcap || tokenInfo?.sale_Params?.hardcap)} ICP`
                  : <Skeleton width={70} height={20} />}
              </span>

            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Liquidity</span>
              <span className="text-lg font-semibold">

                <span className="text-lg font-semibold">
                  {projectData?.sale_details?.liquidity_percentage || tokenInfo.sale_Params && tokenInfo?.sale_Params?.liquidity_percentage
                    ? `${Number(projectData?.sale_details?.liquidity_percentage || tokenInfo.sale_Params && tokenInfo?.sale_Params?.liquidity_percentage)}%`
                    : <Skeleton width={40} height={15} />}
                </span>

              </span>
            </div>
            <div className="flex flex-col">
              {tokenInfo && (
                <SaleStart
                  style={{ text_heading: 'text-sm', text_content: 'text-lg' }}
                  setTokenPhase={setTokenPhase}
                  presaleData={projectData?.sale_details || tokenInfo.sale_Params && tokenInfo?.sale_Params}
                />
              )}
            </div>
            <button onClick={handleViewMoreClick} className="border-b-2 border-r-gray-600 w-20 cursor-pointer">
              View More
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectCard;