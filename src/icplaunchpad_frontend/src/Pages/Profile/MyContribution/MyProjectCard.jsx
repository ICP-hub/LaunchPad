import React, { useEffect, useState } from 'react';
import person1 from '../../../../assets/images/carousel/person1.png';
import l3 from '../../../../assets/images/carousel/l3.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../StateManagement/useContext/useAuth';
import { Principal } from '@dfinity/principal';

const MyProjectCard = ({ projectData, index }) => {
    const protocol = process.env.DFX_NETWORK === 'ic' ? 'https' : 'http';
    const domain = process.env.DFX_NETWORK === 'ic' ? 'raw.icp0.io' : 'localhost:4943';
    const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;

    const { createCustomActor, actor } = useAuth();
    const [TokenImg, setTokenImg] = useState();
    const [isFetchingIMG, setFetchingIMG] = useState(false);
    const [TokenData, setTokenData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (projectData.ledger_canister_id) FetchProjectData();
    }, [projectData.ledger_canister_id]);

    const FetchProjectData = async () => {
        const ledgerId = projectData.ledger_canister_id;
        const ledgerActor = await createCustomActor(ledgerId);

        if (ledgerActor) {
            console.log('ledgerActor', ledgerActor);
            const name = await ledgerActor.icrc1_name();
            console.log('Token Name:', name);
            setTokenData((prevData) => ({ ...prevData, token_name: name }));
        }

        if (ledgerId && actor) {
            try {
                const ledgerPrincipal = Principal.fromText(ledgerId); // Corrected variable
                const tokenImgId = await actor.get_token_image_id(ledgerPrincipal);
                console.log('Fetched token image ID:', tokenImgId);

                if (tokenImgId && tokenImgId.length > 0) {
                    const imageUrl = `${protocol}://${canisterId}.${domain}/f/${tokenImgId[tokenImgId.length - 1]}`;
                    setTokenImg(imageUrl);
                    console.log('Token Image URL:', imageUrl);
                }
                setFetchingIMG(true);
            } catch (error) {
                console.error('Error fetching token image:', error);
            }
        }
    };

    useEffect(() => {
        if (projectData.canister_id) fetchTokenIMG();
    }, [projectData.canister_id]);

    const fetchTokenIMG = async () => {
        try {
            const ledgerPrincipal = Principal.fromText(projectData.canister_id); // Corrected variable
            const tokenImgId = await actor.get_token_image_id(ledgerPrincipal);
            console.log('Fetched token image ID:', tokenImgId);

            if (tokenImgId && tokenImgId.length > 0) {
                const imageUrl = `${protocol}://${canisterId}.${domain}/f/${tokenImgId[tokenImgId.length - 1]}`;
                setTokenImg(imageUrl);
                console.log('Token Image URL:', imageUrl);
            }
            setFetchingIMG(true);
        } catch (error) {
            console.error('Error fetching token image:', error);
        }
    };

    const handleViewMoreClick2 = () => {
        if (isFetchingIMG) {
            const canisterId = projectData.ledger_canister_id;
            if (projectData.ledger_canister_id && TokenData) {
                console.log('Navigating with ledger_canister_id and TokenData:', {
                    canister_id: projectData.ledger_canister_id,
                });

                navigate('/token-page', {
                    state: {
                        projectData: {
                            canister_id: projectData.ledger_canister_id,
                            token_name: TokenData.token_name,
                            TokenImg
                        }
                    }
                });
            } else {
                console.log('Navigating without ledger_canister_id or TokenData:', {
                    ...projectData,
                    TokenImg
                });

                navigate('/token-page', {
                    state: {
                        projectData: {
                            ...projectData,
                            TokenImg,
                            // canister_id: canisterId,
                        }
                    }
                });
            }
        }
    };

    return (
        <div>
            <div
                key={index}
                onClick={handleViewMoreClick2}
                className="bg-[#FFFFFF1A] cursor-pointer text-white p-1 rounded-xl flex flex-col ss2:w-[325px] xxs1:w-[400px] mt-14"
            >
                <div className="h-[280px] rounded-lg py-5 flex flex-col">
                    <div className="relative">
                        <img
                            src={TokenImg ? TokenImg : person1}
                            className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[50%] rounded-full object-cover  h-[100px] w-[100px] md:h-[114px] md:w-[114px]"
                            alt="logo"
                        />
                        <div className="absolute top-[20px] right-[60px] ss2:right-[100px] xxs1:right-[130px] w-10 h-10 rounded-full border-1 border-gray-300">
                            <img src={l3} alt="small" className="object-cover w-full h-full" />
                        </div>
                    </div>

                    <div className="mt-[70px] text-center text-white space-y-5">
                        <div className="text-[24px] font-semibold">{projectData?.token_name || TokenData?.token_name}</div>
                        <div className="text-[16px] text-[#FFFFFFA6] font-medium">FAIR LAUNCH - MAX BUY 5 SOL</div>
                        <div className="text-[#FFC145] text-[18px] font-normal">UPCOMING</div>
                    </div>

                    <div className="bg-[#FFFFFF66] h-[2px] w-[92%] mx-auto mt-6"></div>
                </div>

                <div className="flex">
                    <div className="relative flex items-center overflow-hidden w-[60%] h-72">
                        <div className="absolute left-[-110%] ss2:left-[-62%] xxs1:left-[-30%] sm:left-[-20%] md:left-[-45%] top-0 w-72 h-72">
                            <svg className="transform rotate-90" viewBox="0 0 36 36">
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
                                    strokeDasharray={`${10.1 * 4}, 100`} // progress bar
                                />
                            </svg>
                            <div className="absolute ml-28 ss2:ml-10 inset-0 flex flex-col items-center justify-center">
                                <span>Progress</span>
                                <span className="text-lg font-semibold text-white">({10.1}%)</span>
                                <span className="text-sm text-gray-400 mt-1">{"30%"} SOL RAISED</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 w-[40%] flex flex-col justify-around">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-400">HARD</span>
                            <span className="text-lg font-semibold bg-gradient-to-r from-[#f09787] to-[#CACCF5] text-transparent bg-clip-text">
                                {"200 ETH"}
                            </span>
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
                            <span className="text-sm text-gray-400">Sale Starts In</span>
                            <span className="text-lg font-semibold">{"00:29:23:00"}</span>
                        </div>
                        <button onClick={handleViewMoreClick2} className="border-b-2 border-r-gray-600 w-20 cursor-pointer">
                            View More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProjectCard;
