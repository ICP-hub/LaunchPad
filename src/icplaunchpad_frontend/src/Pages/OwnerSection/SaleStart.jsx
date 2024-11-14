import React, { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
import { SuccessfulSalesHandlerRequest } from '../../StateManagement/Redux/Reducers/SuccessfulSales';
import { upcomingSalesHandlerRequest } from '../../StateManagement/Redux/Reducers/UpcomingSales';

const SaleStart = ({ style, setTokenPhase, presaleData }) => {
    // const dispatch = useDispatch();
    const [timeRemaining, setTimeRemaining] = useState("Loading...");
    const [phase, setPhase] = useState("upcoming"); // Track the sale phase internally

    useEffect(()=>{
        setPhase('upcoming')
    },[presaleData])

    useEffect(() => {

        if (!presaleData || !presaleData.start_time_utc || !presaleData.end_time_utc) return;
    
        const convertTimestampToDate = (timestamp) => {
            try {
                return BigInt(timestamp) > 1_000_000_000_000n
                    ? new Date(Number(timestamp / 1_000_000n)) // nanoseconds to milliseconds
                    : new Date(Number(timestamp) * 1000);      // seconds to milliseconds
            } catch (e) {
                console.error("Invalid timestamp:", timestamp);
                return null;
            }
        };

        const start = convertTimestampToDate(presaleData.start_time_utc);
        const end = convertTimestampToDate(presaleData.end_time_utc);

        if (!start || !end) return;

        const updateCountdown = () => {
            const now = new Date();

            if (now >= end && phase !== "ended") {
        console.log('hii ended')
            
                setTimeRemaining("Sale Ended!");
                setTokenPhase("SUCCESSFULL");
                setPhase("ended");
                return;
            }

            if (now >= start && now < end && phase !== "ongoing") {
                console.log('hii ongoing')
                setTimeRemaining("Sale Started!");
                setTokenPhase("ONGOING");
                // dispatch(upcomingSalesHandlerRequest());
                setPhase("ongoing");
                return;
            }

            if (phase === "upcoming") {
                const timeLeft = start - now;
                const days = String(Math.floor(timeLeft / (1000 * 60 * 60 * 24))).padStart(2, '0');
                const hours = String(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
                const minutes = String(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                const seconds = String(Math.floor((timeLeft % (1000 * 60)) / 1000)).padStart(2, '0');
                setTimeRemaining(`${days}:${hours}:${minutes}:${seconds}`);
                setTokenPhase("UPCOMING")
            }
        };

        const intervalId = setInterval(updateCountdown, 1000);
       
        updateCountdown();

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, [presaleData, setTokenPhase, phase]);

    return (
        <>
            <p className={`${style.text_heading} mb-2`}>{(timeRemaining === "Sale Started!" || timeRemaining === "Sale Ended!") ? "" : "SALE STARTS IN"}</p>
            <div className={`${style.text_content} font-bold`} >{timeRemaining}</div>
        </>
    );
};

export default SaleStart;
