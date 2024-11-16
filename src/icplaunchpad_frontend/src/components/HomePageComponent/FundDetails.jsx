import React, { useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import { convertTimestampToISTFormatted } from '../../utils/convertTimestampToIST';
import { useAuth } from '../../StateManagement/useContext/useClient';
import { useSelector } from 'react-redux';

const FundDetails = ({ sale, index }) => {
    const [tokenDetails, setTokenDetails] = useState({});
    const {  createCustomActor } = useAuth();
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
            if (ledgerId) {
              const customActor = await createCustomActor(ledgerId);

                if (customActor) {
                    const tokenName = await customActor.icrc1_name();
                    setTokenDetails((prev) => ({ ...prev, token_name: tokenName }));
                }

                // Fetching the owner of the token
                const owner = await customActor.icrc1_minting_account();
                if (owner) {
                    const ownerBalance = await customActor.icrc1_balance_of(owner[0]);
                    setTokenDetails((prevData) => ({
                        ...prevData,
                        owner_bal: ownerBalance.toString(),
                        owner: owner[0].owner.toString(),
                    }));
                }

                // Fetching token image
                if (actor) {
                    const ledgerPrincipal = Principal.fromText(ledgerId);
                    const tokenImgId = await actor.get_token_image_id(ledgerPrincipal);
                    console.log('Fetched token image ID:', tokenImgId);

                    if (tokenImgId && tokenImgId.length > 0) {
                        const imageUrl = `${protocol}://${canisterId}.${domain}/f/${tokenImgId[tokenImgId.length - 1]}`;
                        console.log('Token Image URL:', imageUrl);
                        setTokenDetails((prev) => ({ ...prev, token_image: imageUrl }));
                    }
                }
            }
        } catch (err) {
            console.error('Error fetching token data:', err);
        }
    };


    return (
        <tr key={index} className="text-base">
            <td className="py-3 px-6">{index + 1}</td>
            <td className="flex h-8 w-8 rounded-full">
                <img src={tokenDetails.token_image || ""} alt="Logo" className="object-cover rounded-full h-full w-full mr-2" />
                {tokenDetails.token_name || "N/A"}
            </td>
            <td className="py-3 px-6"> {tokenDetails ? tokenDetails.owner_bal : 0 } ICP</td>
            <td className="py-3 px-6">{` ${sale.sale_details.listing_rate} ICP `}</td>
            <td className="py-3 px-6">Token Sale</td>
            <td className="py-3 px-6">{convertTimestampToISTFormatted(sale.sale_details.end_time_utc)}</td>
        </tr>
    );
};

export default FundDetails;
