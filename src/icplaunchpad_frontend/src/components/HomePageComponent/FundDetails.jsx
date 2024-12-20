import React, { useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import { convertTimestampToISTFormatted } from '../../utils/convertTimestampToIST';
import { useAuths } from '../../StateManagement/useContext/useClient';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import { fetchWithRetry } from '../../utils/fetchWithRetry';

const FundDetails = ({ sale, index }) => {
    const [tokenDetails, setTokenDetails] = useState({});
    const {  createCustomActor } = useAuths();
    const actor = useSelector((currState) => currState.actors.actor);
 
    const protocol = process.env.DFX_NETWORK === 'ic' ? 'https' : 'http';
    const domain = process.env.DFX_NETWORK === 'ic' ? 'raw.icp0.io' : 'localhost:4943';
    const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;

    useEffect(() => {
        if (sale.ledger_canister_id) {
            fetchTokenData(sale.ledger_canister_id);
        }
    }, [sale]);

    const fetchTokenData = async (ledgerId) => {
        try {
            console.log("Fetching token data for ledger ID:", ledgerId);
    
            if (!ledgerId) {
                console.error("Invalid ledger ID provided.");
                return;
            }
    
            const customActor = await createCustomActor(ledgerId);
    
            if (!customActor) {
                console.error("Failed to create custom actor for the ledger ID.");
                return;
            }
    
            console.log("Custom actor created successfully:", customActor);
    
            // Fetch token data using Promise.allSettled
            const tokenDataResults = await Promise.allSettled([
                fetchWithRetry(() => customActor.icrc1_name(), 3, 1000),
                fetchWithRetry(() => customActor.icrc1_symbol(), 3, 1000),
                fetchWithRetry(() => customActor.icrc1_minting_account(), 3, 1000),
            ]);
    
            console.log("Token Data Results:", tokenDataResults);
    
            const tokenName = tokenDataResults[0].status === "fulfilled" ? tokenDataResults[0].value : null;
            const tokenSymbol = tokenDataResults[1].status === "fulfilled" ? tokenDataResults[1].value : null;
            const mintingAccount = tokenDataResults[2].status === "fulfilled" ? tokenDataResults[2].value : null;
    
            // Set token name and symbol
            if (tokenName && tokenSymbol) {
                setTokenDetails((prev) => ({
                    ...prev,
                    token_name: tokenName,
                    token_symbol: tokenSymbol,
                }));
            } else {
                console.error("Failed to fetch token name or symbol.");
            }
    
            // Fetch owner balance if minting account exists
            if (mintingAccount && mintingAccount[0]) {
                const ownerBalance = await fetchWithRetry(() => customActor.icrc1_balance_of(mintingAccount[0]), 3, 1000);
                setTokenDetails((prevData) => ({
                    ...prevData,
                    owner_bal: ownerBalance?.toString() || "0",
                    owner: mintingAccount[0]?.owner?.toString() || "Unknown",
                }));
            } else {
                console.error("Failed to fetch minting account or owner balance.");
            }
    
            // Fetch token image if the actor is available
            if (customActor) {
                const actorPrincipal = Principal.fromText(ledgerId);
                const tokenImgId = await fetchWithRetry(() => actor.get_token_image_id(actorPrincipal), 3, 1000);
    
                if ( tokenImgId &&tokenImgId?.Ok) {
                    const imageUrl = `${protocol}://${canisterId}.${domain}/f/${tokenImgId?.Ok}`;
                    console.log("Token Image URL:", imageUrl);
                    setTokenDetails((prev) => ({ ...prev, token_image: imageUrl }));
                } else {
                    console.error("Failed to fetch token image.");
                }
            }
        } catch (err) {
            console.error("Error fetching token data:", err);
        }
    };
  console.log('tokenDetails=',tokenDetails)

    return (
        <tr key={index} className="text-base">
            <td className="py-3 px-6 text-center">{index + 1}</td>
           <td className=" py-3 px-6">
           <span className='flex text-center justify-center items-center
           '>
            <img src={tokenDetails.token_image || ""} alt="Logo" className="object-cover h-6 w-6  rounded-full  mr-2" />
            {tokenDetails.token_name || <Skeleton width={60} height={15}/> }
            </span> 
            </td>
            <td className="py-3 px-6 text-center"> {(tokenDetails && tokenDetails.token_symbol) ? tokenDetails.token_symbol : <Skeleton width={60} height={15}/> } </td>
            <td className="py-3 px-6 text-center"> {(tokenDetails && tokenDetails?.owner_bal) ? `${tokenDetails?.owner_bal} ICP` : <Skeleton width={60} height={15}/> } </td>
            <td className="py-3 px-6 text-center">{` ${Number(sale.sale_details.tokens_for_fairlaunch)}`}</td>
            <td className="py-3 px-6 text-center"> Fairlaunch</td>
            <td className="py-3 px-6 whitespace-nowrap text-center">{convertTimestampToISTFormatted(sale.sale_details.end_time_utc)}</td>
        </tr>
    );
};

export default FundDetails;