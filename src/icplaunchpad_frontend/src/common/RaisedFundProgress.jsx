import { Principal } from '@dfinity/principal';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const RaisedFundProgress = ({ ledgerId, projectData, tokenInfo }) => {
    const [fundRaised, setfundRaised] = useState(0);
    const [fundRaisedProgress, setfundRaisedProgress] = useState(0);
    const [progressType, setProgressType] = useState();

    const actor = useSelector((currState) => currState.actors.actor);

    // Calculate sale progress based on fundRaised
    useEffect(() => {
        console.log('projectData=>',projectData?.softcap)
        console.log('tokenInfo=>',tokenInfo)

        const softcap = projectData?.softcap || tokenInfo?.sale_Params?.softcap;
        const hardcap = projectData?.hardcap || tokenInfo?.sale_Params?.hardcap;
        if (fundRaised.Err) {
            setfundRaisedProgress(0)
        }
        else if (fundRaised.Ok && softcap && hardcap) {
            if (fundRaised.Ok <= softcap) {
                const raisedPercent = (fundRaised.Ok / softcap) * 100;
                setfundRaisedProgress(raisedPercent)
                setProgressType('softcap')
            }
            else if (fundRaised.Ok > softcap && fundRaised.Ok <= hardcap) {
                const raisedPercent = (fundRaised.Ok / hardcap) * 100;
                setfundRaisedProgress(raisedPercent)
                setProgressType('hardcap')
            }
        }
    }, [fundRaised, projectData, tokenInfo]);


    useEffect(() => {
        async function getFundRaised() {
            // fetching total fundRaised
            const principalId = Principal.fromText(ledgerId)
            const fundRaised = await actor.get_funds_raised(principalId);
            setfundRaised(fundRaised)
            console.log('fundraised==', fundRaised)
        }
        getFundRaised();
    }, [ledgerId])

    return (
        <div className="relative flex items-center overflow-hidden w-[65%] h-72">
        <div className="absolute left-[-33%] lg:left-[-45%] ss2:left-[-70%] dxs:left-[-47%] xxs1:left-[-30%] sm:left-[-20%] md:left-[-15%] top-0 w-72 h-72">
            <svg className="rotate-[-90deg]" viewBox="0 0 36 36">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop
                            offset="0%"
                            stopColor={progressType === 'softcap' ? '#f77ecf77' : '#81105b77'}
                            stopOpacity="1"
                        />
                        <stop
                            offset="100%"
                            stopColor={progressType === 'softcap' ? '#cac9f5' : '#f77ecf77'}
                            stopOpacity="1"
                        />
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
                    strokeDasharray={`${fundRaisedProgress}, 100`}
                />
            </svg>
            <div className="absolute ml-28 ss2:ml-10 inset-0 flex flex-col items-center justify-center">
                <span>Progress</span>
                <span className="text-lg font-semibold text-white">
                    {fundRaisedProgress.toFixed(2)}%
                </span>
                <span className="text-sm text-gray-400 mt-1">
                    {fundRaised?.Ok || 0} ICP RAISED
                </span>
            </div>
        </div>
    </div>
    )
}

export default RaisedFundProgress