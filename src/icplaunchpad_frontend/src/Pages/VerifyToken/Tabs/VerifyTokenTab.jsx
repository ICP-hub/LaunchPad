
import React, { useEffect, useRef, useState } from "react";
import { Principal } from "@dfinity/principal";
import { useAuths } from "../../../StateManagement/useContext/useClient";
import CopyToClipboard from "../../../common/CopyToClipboard";
import { useAgent } from "@nfid/identitykit/react";
import { fetchWithRetry } from "../../../utils/fetchWithRetry";

const VerifyTokenTab = ({ register, errors, setTokenData, watch, ledger_canister_id, tokenData }) => {
  const [tokenInfo, setTokenInfo] = useState(null);
  const { createCustomActor } = useAuths();
  const agent = useAgent()

  // console.log('ledger_canister_id',ledgerPrincipalId.toText()); 
  useEffect(() => {
    if (ledger_canister_id) {
        if (typeof ledger_canister_id !== 'string') {
            const ledgerId = Principal.fromUint8Array(ledger_canister_id);
            getTokenData(ledgerId.toText());
        } else {
            const ledgerId = Principal.fromText(ledger_canister_id);
            getTokenData(ledgerId);
        }
    }
}, [ledger_canister_id]);

const getTokenData = async (ledger_canister_id) => {
    try {
        console.log("Fetching token data for canister ID:", ledger_canister_id);

        const actor = await createCustomActor(ledger_canister_id);

        if (!actor) {
            console.error("Actor creation failed.");
            return;
        }

        console.log("Actor created successfully:", actor);

        // Fetch token data using Promise.allSettled
        const tokenDataResults = await Promise.allSettled([
            fetchWithRetry(() => actor?.icrc1_name?.(), 3, 1000),
            fetchWithRetry(() => actor?.icrc1_symbol?.(), 3, 1000),
            fetchWithRetry(() => actor?.icrc1_decimals?.(), 3, 1000),
            fetchWithRetry(() => actor?.icrc1_total_supply?.(), 3, 1000),
        ]);

        console.log("Token Data Results:", tokenDataResults);

        // Process the settled promises
        const tokenName = tokenDataResults[0].status === "fulfilled" ? tokenDataResults[0].value : null;
        const tokenSymbol = tokenDataResults[1].status === "fulfilled" ? tokenDataResults[1].value : null;
        const tokenDecimals = tokenDataResults[2].status === "fulfilled" ? tokenDataResults[2].value : null;
        const tokenSupply = tokenDataResults[3].status === "fulfilled" ? tokenDataResults[3].value : null;

        // Check if all required data is available
        if (!tokenName || !tokenSymbol || !tokenDecimals || !tokenSupply) {
            console.error("Error: Some token data could not be fetched.");
            return;
        }

        setTokenInfo({
            token_name: tokenName,
            token_symbol: tokenSymbol,
            decimals: tokenDecimals,
            total_supply: tokenSupply,
        });

    } catch (err) {
        console.error("Error fetching token data:", err);
    }
};



  
  const feeOption = watch("feeOption", false);
  const currencyICP = watch("currencyICP", false);

  const onChange = (event) => {
    const updatedData = tokenData ? { ...tokenData } : {}; // Ensures tokenData is defined
    updatedData[event.target.name] = event.target.value;
    setTokenData(updatedData);
  };

  useEffect(() => {
    if (tokenInfo) {
      register('token_name', { value: tokenInfo.token_name });
      register('token_symbol', { value: tokenInfo.token_symbol });
      register('decimals', { value: Number(tokenInfo.decimals) });
      register('total_supply', { value: Number(tokenInfo.total_supply) });
    }
  }, [tokenInfo, register]);

  
  return (
    <div className="bg-[#222222] p-4 xxs1:p-8 m-4 rounded-2xl mb-[80px] dxs:mb-[140px] xxs1:mb-[90px] sm2:mb-[70px]  md:mb-[15px]">
      <div className="bg-[#222222] w-full max-w-[1070px] h-[920px] xxs1:h-[850px] sm2:h-[780px] md:h-[800px] dlg:h-[780px] p-4 xxs1:p-8 rounded-2xl">
        <div className="flex  mb-8 bg-[rgb(68,68,68)] pl-6 p-2 mt-[-31px] mx-[-17px] xxs1:mx-[-31px] rounded-2xl">
          <span className="text-white text-[22px]"> Verify Token</span>
        </div>

        <h2 className="text-lg font-semibold mb-4">Canister ID</h2>
        <CopyToClipboard address={ledger_canister_id} style={true} />

        <div className="mb-8 mt-8">
          <div className="flex justify-between border-b-2 py-1 border-[#FFFFFF80]">
            <p>Name</p>
            <p>{tokenInfo?.token_name || "N/A"}</p>
          </div>
          <div className="flex justify-between border-b-2 py-1 border-[#FFFFFF80]">
            <p>Symbol</p>
            <p>{tokenInfo?.token_symbol || "N/A"}</p>
          </div>
          <div className="flex justify-between border-b-2 py-1 border-[#FFFFFF80]">
            <p>Decimals</p>
            <p>{tokenInfo?.decimals || "N/A"}</p>
          </div>
          <div className="flex justify-between border-b-2 py-1 border-[#FFFFFF80]">
            <p>Total Supply</p>
            <p>{Number(tokenInfo?.total_supply) || 0}</p>
          </div>

        </div>

        <div className="mb-4">
          <p className="mb-2">Currency</p>
          <label className="flex items-center">
            <input
              type="checkbox"
              // {...register("currencyICP")}
              checked
              onChange={(e) => setTokenData({ ...tokenData, currencyICP: e.target.checked })}
              className="hidden peer"
            />
            <div className="w-4 h-4 bg-transparent border-2 border-white rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] flex items-center justify-center mr-2">
              <div className="w-1.5 h-1.5 bg-transparent peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] rounded-full"></div>
            </div>
            ICP
          </label>
          <p className="text-gray-400 text-sm">(User will pay with ICP for your token)</p>
        </div>

        {/* <div className="mb-4">
          <p className="mb-2">Fee Options</p>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("feeOption")}
              checked={feeOption}
              onChange={(e) => setTokenData({ ...tokenData, feeOption: e.target.checked })}
              className="hidden peer"
            />
            <div className="w-4 h-4 bg-transparent border-2 border-white rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] flex items-center justify-center mr-2">
              <div className="w-1.5 h-1.5 bg-transparent peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] rounded-full"></div>
            </div>
            5% ETH Raise Only
          </label>
        </div> */}

        <div className="mb-11">
          <p className="mb-2">Listing Options</p>
          <label className="flex items-center">
            <input
              type="checkbox"
              // {...register("ListingOption")}
              checked
              onChange={(e) => setTokenData({ ...tokenData, feeOption: e.target.checked })}
              className="hidden peer"
            />
            <div className="w-4 h-4 bg-transparent border-2 border-white rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] flex items-center justify-center mr-2">
              <div className="w-1.5 h-1.5 bg-transparent peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] rounded-full"></div>
            </div>
            Auto Listing
          </label>
        </div>

        <div className="bg-[#F5F5F51A] text-white p-3 rounded-md dlg:mb-8">
          <ul className="text-[12px] sm:text-[15px] px-2 ss2:px-7 ss2:py-4 list-disc">
            <li>Token verification ensures that your token meets the required standards for authenticity and compliance, giving users confidence in your project.</li>
            <li>Verified tokens build trust and credibility among potential investors and contributors, increasing the chances of successful participation in your project.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VerifyTokenTab;