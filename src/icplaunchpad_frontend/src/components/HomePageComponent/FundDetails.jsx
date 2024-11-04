import React, { useEffect, useState } from 'react';
import { useAuth } from '../../StateManagement/useContext/useAuth';
import { Principal } from '@dfinity/principal';

const FundDetails = ({ sale, index }) => {
    const [tokenDetails, setTokenDetails] = useState({});
    const { actor, createCustomActor } = useAuth();
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
            const customActor = await createCustomActor(ledgerId);
            if (customActor) {
                const tokenName = await customActor.icrc1_name();
                setTokenDetails((prev) => ({ ...prev, token_name: tokenName }));
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
        } catch (err) {
            console.error('Error fetching token data:', err);
        }
    };

    function convertTimestampToISTFormatted(timestamp) {
        if (!timestamp) return "N/A";

        const timestampBigInt = BigInt(timestamp);

        const secondsTimestamp = timestampBigInt > 1_000_000_000_000n
            ? timestampBigInt / 1_000_000_000n
            : timestampBigInt;

        const date = new Date(Number(secondsTimestamp) * 1000 + (5 * 60 + 30) * 60 * 1000);

        const year = date.getUTCFullYear();
        const monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getUTCMonth()];
        const day = date.getUTCDate();

        const daySuffix = (day) => {
            if (day % 10 === 1 && day !== 11) return `${day}st`;
            if (day % 10 === 2 && day !== 12) return `${day}nd`;
            if (day % 10 === 3 && day !== 13) return `${day}rd`;
            return `${day}th`;
        };

        return `${month} ${daySuffix(day)} ${year}`;
    }

    return (
        <tr key={index} className="text-base">
            <td className="py-3 px-6">{index + 1}</td>
            <td className="flex h-8 w-8 rounded-full">
                <img src={tokenDetails.token_image || ""} alt="Logo" className="object-cover rounded-full h-full w-full mr-2" />
                {tokenDetails.token_name || "N/A"}
            </td>
            <td className="py-3 px-6">400,000 ICP</td>
            <td className="py-3 px-6">{` ${sale.sale_details.listing_rate} ICP `}</td>
            <td className="py-3 px-6">Token Sale</td>
            <td className="py-3 px-6">{convertTimestampToISTFormatted(sale.sale_details.end_time_utc)}</td>
        </tr>
    );
};

export default FundDetails;
