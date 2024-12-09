import React, { useEffect, useState } from 'react';
import person1 from '../../../../assets/images/carousel/user.png';
import icp from '../../../../assets/images/icp.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../StateManagement/useContext/useClient';
import { useSelector } from 'react-redux';
import { Principal } from '@dfinity/principal';

const ProjectCard = ({ ledgerID, index }) => {
  const navigate = useNavigate();
  const { createCustomActor } = useAuth();
  const actor = useSelector((currState) => currState.actors.actor);

  const [tokenInfo, setTokenInfo] = useState({});
  const [isFetchingIMG, setFetchingIMG] = useState(false);

  const protocol = process.env.DFX_NETWORK === 'ic' ? 'https' : 'http';
  const domain = process.env.DFX_NETWORK === 'ic' ? 'raw.icp0.io' : 'localhost:4943';
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;

  const handleExportNavigate = async ()=>{
    console.log('hii',ledgerID)
    try{
    const ledgerPrincipal = Principal.fromUint8Array(ledgerID);
    console.log(ledgerID.toText())
    const response = await actor.get_sale_params(ledgerID);
    console.log(response)
    if (response.Err)
      navigate("/verify-token", {
        state: {ledger_canister_id: ledgerID.toText() },}
      )

  } catch (error) {
    console.error('Error fetching sale params:', error);
  }

  }

  // Fetch project data if ledger canister ID is available
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const ledgerActor = await createCustomActor(ledgerID);
        console.log('ledgerActor',ledgerActor)
        if (!ledgerActor) {
          console.error(`Unable to create ledger actor for ledgerID: ${ledgerID}`);
          return;
        }

        const [token_name, token_symbol, decimals, total_supply] = await Promise.all([
          ledgerActor.icrc1_name(),
          ledgerActor.icrc1_symbol(),
          ledgerActor.icrc1_decimals(),
          ledgerActor.icrc1_total_supply() ,
        ]);
        
        console.log('total_supply',total_supply)
        setTokenInfo((prev) => ({ ...prev, token_name, token_symbol, decimals, total_supply }));
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

        const [tokenImgId, coverImgId] = await Promise.all([
          actor.get_token_image_id(ledgerID),
          actor.get_cover_image_id(ledgerID),
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
        console.error('Error fetching token images:', error);
      }
    };

    if (ledgerID) fetchTokenInfo();
  }, [actor, ledgerID, canisterId, domain, protocol]);

  return (
    <div onClick={handleExportNavigate}>
      <div
        key={index}
        className="bg-[#FFFFFF1A]  text-white p-1 pb-4 rounded-xl flex flex-col w-[340px] md:w-[375px] mt-14 mx-0 sm:mx-2"
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
            <div className="text-[24px] font-semibold">{tokenInfo?.token_name || 'N/A'}</div>
            <div className="text-[16px] text-[#FFFFFFA6] font-medium">TOKEN INFO</div>
          </div>
          <div className="bg-[#FFFFFF66] h-[2px] w-[92%] mx-auto mt-5"></div>
        </div>

{/* secondary UI */}
<div className="mb-3 flex flex-wrap gap-4 justify-center">
  <div className="flex flex-col items-center bg-gradient-to-r from-[#1d1e22] via-[#25282d] to-[#1d1e22] rounded-lg p-4 shadow-lg w-[45%]">
    <span className="text-xs text-gray-300 tracking-wide">TOKEN SYMBOL</span>
    <span className="text-lg font-bold text-gradient bg-gradient-to-r from-[#f09787] to-[#CACCF5] text-transparent bg-clip-text">
      {tokenInfo?.token_symbol || 'N/A'}
    </span>
  </div>
  <div className="flex flex-col items-center bg-gradient-to-r from-[#1d1e22] via-[#25282d] to-[#1d1e22] rounded-lg p-4 shadow-lg w-[45%]">
    <span className="text-xs text-gray-300 tracking-wide">DECIMALS</span>
    <span className="text-lg font-bold text-white">
      {tokenInfo?.decimals || 'N/A'}
    </span>
  </div>
  <div className="flex flex-col items-center bg-gradient-to-r from-[#1d1e22] via-[#25282d] to-[#1d1e22] rounded-lg p-4 shadow-lg w-[90%]">
    <span className="text-xs text-gray-300 tracking-wide">TOTAL SUPPLY</span>
    <span className="text-lg font-bold text-white">
      {Number(tokenInfo?.total_supply) || 'N/A'}
    </span>
  </div>
</div>


      </div>
    </div>
  );
};

export default ProjectCard;
