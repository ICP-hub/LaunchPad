import { Principal } from '@dfinity/principal';
import React, { useEffect, useState, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';

const RaisedFundProgress = ({ ledgerId, projectData, tokenInfo, comp }) => {
    const [fundRaised, setFundRaised] = useState(null);
    const [progressType, setProgressType] = useState('');
    const [progress, setProgress] = useState(null);
    // const fundRaise =13;
    const actor = useSelector((currState) => currState.actors.actor);

    const softcap = Number(projectData?.softcap ?? tokenInfo?.sale_Params?.softcap);
    const hardcap = Number(projectData?.hardcap ?? tokenInfo?.sale_Params?.hardcap);

    const { calculatedProgress, type } = useMemo(() => {
        let calculatedProgress = 0;
        let type = '';
        if (softcap > 0 && hardcap > 0) {
            if (fundRaised <= softcap) {
                type = 'softcap';
                calculatedProgress = (fundRaised / softcap) * 100;
            } else if (fundRaised <= hardcap) {
                type = 'hardcap';
                calculatedProgress = (fundRaised / hardcap) * 100;
            } else {
                type = 'beyond';
                calculatedProgress = 100; // Beyond hardcap
            }
        }
        return { calculatedProgress, type };
    }, [fundRaised, softcap, hardcap]);

    useEffect(() => {
        setProgressType(type);
        // Delay updating progress to ensure smoother transitions
        const timeout = setTimeout(() => {
            setProgress(calculatedProgress);
        }, 200); // Adjust delay (200ms) as needed
        return () => clearTimeout(timeout);
    }, [calculatedProgress, type]);

    useEffect(() => {
        async function fetchAndSetFunds() {
            try {
                if (ledgerId && actor) {
                    const principalId = typeof ledgerId === 'string'
                        ? Principal.fromText(ledgerId)
                        : Principal.fromUint8Array(ledgerId);

                    const response = await actor.get_funds_raised(principalId);
                    setFundRaised(response?.Ok || 0); // Default to 0 if response is undefined
                }
            } catch (error) {
                console.error(`Error fetching funds raised for ledgerId: ${ledgerId}`, error);
            }
        }
        fetchAndSetFunds();
    }, [ledgerId, actor]);

    const gradientColors = useMemo(() => {
        const colors = {
            softcap: ['#00C6FF', '#0072FF'],
            hardcap: ['#FFD700', '#FF4500'],
            beyond: ['#32CD32', '#008000'],
        };
        return colors[progressType] || ['#ccc', '#ccc'];
    }, [progressType]);

    const gradientId = `gradient-${progressType}`;

    return (
        <div className="relative flex items-center overflow-hidden w-[65%] h-72">
            <div
                className='absolute top-0 w-72 h-72 -left-28'
            >
                <svg className="rotate-[-17deg]" viewBox="0 0 36 36">
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={gradientColors[0]} />
                            <stop offset="100%" stopColor={gradientColors[1]} />
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
                        stroke={`url(#${gradientId})`}
                        strokeWidth="3.8"
                        strokeDasharray={`${(progress / 1.66)}, 60`} // Scale progress to fit the half-circle
                        style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
                    />

                </svg>
                <div className="absolute ml-28 ss2:ml-10 inset-0 flex flex-col items-center justify-center">
                    <span>Progress</span>
                    <span className="text-lg font-semibold text-white">
                        {progress!==null ?  `${progress.toFixed(2)}%` : <Skeleton width={50} height={15}/> }
                    </span>
                    <span className="text-sm text-gray-400 mt-1">
                        {(fundRaised !== null) ? ` ${fundRaised} ICP RAISED` : <Skeleton width={80} height={15}/> }
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RaisedFundProgress;
