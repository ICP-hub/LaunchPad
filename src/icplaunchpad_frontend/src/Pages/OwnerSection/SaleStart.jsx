import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SuccessfulSalesHandlerRequest } from '../../StateManagement/Redux/Reducers/SuccessfulSales';
import { upcomingSalesHandlerRequest } from '../../StateManagement/Redux/Reducers/UpcomingSales';

const SaleStart = ({ style,setTokenPhase, presaleData }) => {
    console.log('from saleStart',presaleData)
   const dispatch= useDispatch()
    const [timeRemaining, setTimeRemaining] = useState("Loading...");

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

            if (now >= end) { 
                setTimeRemaining("Sale Ended!"); // Update state to show "Sale Ended!"
                setTokenPhase("SUCCESSFULL")
                // dispatch(SuccessfulSalesHandlerRequest())
                return; // Stop here, no need for further calculations
            }

            const timeLeft = start - now;

            if (timeLeft <= 0) {
                setTimeRemaining("Sale Started!");
                setTokenPhase("RUNNING")
                // dispatch(upcomingSalesHandlerRequest())
                return;
            }

            const days = String(Math.floor(timeLeft / (1000 * 60 * 60 * 24))).padStart(2, '0');
            const hours = String(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            const minutes = String(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            const seconds = String(Math.floor((timeLeft % (1000 * 60)) / 1000)).padStart(2, '0');

            setTimeRemaining(`${days}:${hours}:${minutes}:${seconds}`);
        };

        const intervalId = setInterval(updateCountdown, 1000);
        updateCountdown();

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, [presaleData]);

    return (
        <>
            <p className={`${style.text_heading} mb-2 `}>{(timeRemaining === "Sale Started!" || timeRemaining === "Sale Ended!") ? "" : "SALE STARTS IN"}</p>
            <div className={ `${style.text_content} font-bold`} >{timeRemaining}</div>
        </>
    );
};

export default SaleStart;