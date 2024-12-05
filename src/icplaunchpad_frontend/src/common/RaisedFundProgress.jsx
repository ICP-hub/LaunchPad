import { Principal } from '@dfinity/principal';
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

const RaisedFundProgress = ({ ledgerId, projectData, tokenInfo, comp }) => {
    const [fundRaised, setFundRaised] = useState(0);
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const [progressType, setProgressType] = useState('');

    const actor = useSelector((currState) => currState.actors.actor);

    const softcap = Number(projectData?.softcap ?? tokenInfo?.sale_Params?.softcap);
    const hardcap = Number(projectData?.hardcap ?? tokenInfo?.sale_Params?.hardcap);

    // Memoize the fundRaisedProgress and progressType calculations
    const { progress, type } = useMemo(() => {
        let progress = 0;
        let type = '';
        if (softcap > 0 && hardcap > 0) {
            if (fundRaised <= softcap) {
                type = 'softcap';
                progress = (fundRaised / softcap) * 100;
            } else if (fundRaised <= hardcap) {
                type = 'hardcap';
                progress = (fundRaised / hardcap) * 100;
            } else {
                type = 'beyond';
                progress = 100; // Beyond hardcap
            }
        }
        return { progress, type };
    }, [fundRaised, softcap, hardcap]);

    // Update progressType state based on memoized value
    useEffect(() => {
        setProgressType(type);
    }, [type]);

    // Fetch fundRaised from the actor
    useEffect(() => {
        async function fetchAndSetFunds() {
            try {
                if (ledgerId && actor) {
                    const principalId = Principal.fromText(ledgerId);
                    const response = await actor.get_funds_raised(principalId);
                    setFundRaised(response?.Ok || 0); // Default to 0 if response is undefined
                }
            } catch (error) {
                console.error(`Error fetching funds raised for ledgerId: ${ledgerId}`, error);
            }
        }
        fetchAndSetFunds();
    }, [ledgerId, actor]);

    // Handle animated progress
    useEffect(() => {
        let timeout;
        const frameDuration = 100; // Frame duration in ms for smoother progress

        const animateProgress = () => {
            setAnimatedProgress((prev) => {
                const next = Math.min(prev + 0.5, progress); // Increment by a smaller value
                if (next < progress) {
                    timeout = setTimeout(animateProgress, frameDuration);
                }
                return next;
            });
        };

        setAnimatedProgress(0); // Reset animation
        animateProgress();

        return () => clearTimeout(timeout); // Cleanup
    }, [progress]);

    // Define gradient colors dynamically
    const gradientColors = useMemo(() => {
        const colors = {
            softcap: ['#00C6FF', '#0072FF'],
            hardcap: ['#FFD700', '#FF4500'],
            beyond: ['#32CD32', '#008000'],
        };
        return colors[progressType] || ['#ccc', '#ccc'];
    }, [progressType]);

    const gradientId = `gradient-${progressType}`; // Unique gradient ID for each progress type

    return (
        <div className="relative flex items-center overflow-hidden w-[65%] h-72">
            <div
                className={`absolute top-0 w-72 h-72 ${
                    comp === 'card'
                        ? '-left-[50%] md:-left-[45%]'
                        : 'left-[-33%] lg:left-[-45%] ss2:left-[-70%] dxs:left-[-47%] xxs1:left-[-30%] sm:left-[-20%] md:left-[-15%]'
                }`}
            >
                <svg className="rotate-[-90deg]" viewBox="0 0 36 36">
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
                        strokeDasharray={`${animatedProgress}, 100`}
                    />
                </svg>
                <div className="absolute ml-28 ss2:ml-10 inset-0 flex flex-col items-center justify-center">
                    <span>Progress</span>
                    <span className="text-lg font-semibold text-white">
                        {animatedProgress.toFixed(2)}%
                    </span>
                    <span className="text-sm text-gray-400 mt-1">
                        {fundRaised} ICP RAISED
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RaisedFundProgress;
