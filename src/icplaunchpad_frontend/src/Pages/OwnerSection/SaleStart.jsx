import React, { useEffect, useState } from 'react';

const SaleStart = ({ presaleData }) => {
    const [timeRemaining, setTimeRemaining] = useState("Loading..."); // Initial state

    useEffect(() => {
        if (!presaleData) return;

        const convertTimestampToDate = (timestamp) => {
            return (BigInt(timestamp) > 1_000_000_000_000n)
                ? new Date(Number(timestamp / 1_000_000n)) // nanoseconds to milliseconds
                : new Date(Number(timestamp) * 1000);      // seconds to milliseconds
        };

        const start = convertTimestampToDate(presaleData.start_time_utc);
        const end = convertTimestampToDate(presaleData.end_time_utc);

        const updateCountdown = () => {
            const now = new Date();

            if (now >= end) { // Check if sale ended first
                setTimeRemaining("Sale Ended!");
                clearInterval(intervalId);
                return;
            }

            const timeLeft = start - now;

            if (timeLeft <= 0) {
                setTimeRemaining("Sale Started!");
                clearInterval(intervalId);
                return;
            }

            const days = String(Math.floor(timeLeft / (1000 * 60 * 60 * 24))).padStart(2, '0');
            const hours = String(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            const minutes = String(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            const seconds = String(Math.floor((timeLeft % (1000 * 60)) / 1000)).padStart(2, '0');

            setTimeRemaining(`${days}:${hours}:${minutes}:${seconds}`);
        };

        const intervalId = setInterval(updateCountdown, 1000);
        updateCountdown(); // Call once to initialize immediately

        return () => clearInterval(intervalId);
    }, [presaleData]);

    return (
        <>
            <p className="text-lg mb-2">SALE STARTS IN</p>
            <div className="text-2xl font-bold">{timeRemaining}</div>
        </>
    );
};

export default SaleStart;
