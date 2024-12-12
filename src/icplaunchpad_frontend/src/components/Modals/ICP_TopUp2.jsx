import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { TfiClose } from "react-icons/tfi";
import { Principal } from "@dfinity/principal";
import { useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";

const ICP_TopUp2 = ({
  isTopUpModal2,
  setTopUpModal2,
  setTopUpModal1,
  topUpCansiter,
}) => {
  const [icpToBurn, setIcpToBurn] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const actor = useSelector((currState) => currState.actors.actor);

  const ICP_TO_CYCLES_CONVERSION = 10.0314; // Conversion rate

  useEffect(() => {
    if (isTopUpModal2) {
      setIsVisible(true);
    }
  }, [isTopUpModal2]);

  const closeModal = () => {
    // if(loading)
    //   return;
    setIsVisible(false);
    setTimeout(() => setTopUpModal2(false), 300);
  };

  const handleIncrementIcp = () => {
    setIcpToBurn((prev) => prev + 1);
    setTotalCycles((prev) => prev + ICP_TO_CYCLES_CONVERSION);
  };

  const handleDecrementIcp = () => {
    if (icpToBurn > 0) {
      setIcpToBurn((prev) => prev - 1);
      setTotalCycles((prev) => prev - ICP_TO_CYCLES_CONVERSION);
    }
  };

  const handleIncrementCycles = () => {
    setIcpToBurn((prev) => prev + 1);
    setTotalCycles((prev) => prev + ICP_TO_CYCLES_CONVERSION);
  };

  const handleDecrementCycles = () => {
    if (totalCycles > 0.0001) {
      setIcpToBurn((prev) => prev - 1);
      setTotalCycles((prev) => prev - ICP_TO_CYCLES_CONVERSION);
    }
  };

  const handleBack = () => {
    if(loading)
      return;

    setIsVisible(false);
    setTimeout(() => {
      setTopUpModal2(false);
      setTopUpModal1(true);
    }, 300);
  };

  const handleInputChange = (e, type) => {
    const value = parseFloat(e.target.value) || 0;
    if (type === "icp") {
      setIcpToBurn(value);
      setTotalCycles(value * ICP_TO_CYCLES_CONVERSION);
    } else if (type === "cycles") {
      setTotalCycles(value);
      setIcpToBurn(value / ICP_TO_CYCLES_CONVERSION);
    }
  };

  const handleTopUpApprove = async () => {
    if (icpToBurn > 0) {
      setLoading(true);
      try {
        const ledgerPrincipal = Principal.fromText(topUpCansiter);
        const cycleAmount = Math.floor(Number(totalCycles)); // Ensures it's an integer

        const response = await actor.obtain_cycles_for_canister(
          cycleAmount,
          ledgerPrincipal
        );
        console.log(response);
        if (response) {
          setLoading(false);
          setTopUpModal2(false);
        }
      } catch (error) {
        console.error("Error in handleTopUpApprove:", error);
        setLoading(false);
      }
    } else {
      console.error("ICP to burn must be greater than 0.");
    }
  };

  return (
    <div>
      <Modal
        isOpen={isTopUpModal2}
        onRequestClose={closeModal}
        contentLabel="ICP Top-Up Modal"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 `}
      >
        <div
          className={`bg-[#222222] w-[95%] sm:w-[90%] max-w-[400px] p-6 rounded-xl font-posterama text-white relative transform transition-all duration-300 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-2xl"
            aria-label="Close Modal"
          >
            <TfiClose />
          </button>

          {/* Header */}
          <h1 className="text-lg font-semibold mt-6 mb-4 text-center">
            How many cycles do you want to send?
          </h1>

          {/* Address */}
          <div className="text-center text-gray-300 text-sm mb-8">
            {topUpCansiter}
          </div>

          {/* Body */}
          <div className="bg-[#333333] rounded-lg p-4 mb-6">
            {/* ICP to Burn Section */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs sm:text-sm">ICP to Burn</span>
              <div className="lg:ml-2 flex items-center space-x-1 md:space-x-2">
                <button
                  onClick={handleDecrementIcp}
                  className="w-8 h-8 bg-[#444444] text-white rounded-lg flex items-center justify-center hover:bg-[#555555]"
                  aria-label="Decrement ICP"
                >
                  -
                </button>
                <input
                  className="w-20 no-spinner text-center bg-[#222222] text-white border border-[#444444] rounded-lg px-2 focus:outline-none focus:ring focus:ring-green-500"
                  value={icpToBurn}
                  onChange={(e) => handleInputChange(e, "icp")}
                  type="number"
                  min="0"
                />
                <button
                  onClick={handleIncrementIcp}
                  className="w-8 h-8 bg-[#444444] text-white rounded-lg flex items-center justify-center hover:bg-[#555555]"
                  aria-label="Increment ICP"
                >
                  +
                </button>
              </div>
              <span className="text-xs md:text-sm">ICP</span>
            </div>

            {/* Total Cycles Section */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm">Total Cycles</span>
              <div className="mr-2 flex items-center space-x-1 md:space-x-2">
                <button
                  onClick={handleDecrementCycles}
                  className="w-8 h-8 bg-[#444444] text-white rounded-lg flex items-center justify-center hover:bg-[#555555]"
                  aria-label="Decrement Cycles"
                >
                  -
                </button>
                <input
                  className="w-20 text-center no-spinner bg-[#222222] text-white border border-[#444444] rounded-lg px-2 focus:outline-none focus:ring focus:ring-green-500"
                  value={totalCycles.toFixed(4)}
                  onChange={(e) => handleInputChange(e, "cycles")}
                  type="number"
                  min="0"
                />
                <button
                  onClick={handleIncrementCycles}
                  className="w-8 h-8 bg-[#444444] text-white rounded-lg flex items-center justify-center hover:bg-[#555555]"
                  aria-label="Increment Cycles"
                >
                  +
                </button>
              </div>
              <span className="text-xs md:text-sm">TC</span>
            </div>
          </div>

          {/* Approve Button */}
          <button
            onClick={handleTopUpApprove}
            className="w-full text-sm bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition flex justify-center items-center focus:outline-none focus:ring focus:ring-green-300"
          >
            {loading ? (
              <ThreeDots
                height="20"
                width="35"
                color="white"
                ariaLabel="loading-indicator"
              />
            ) : (
              "Approve Funds"
            )}
          </button>

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mt-4 w-full text-gray-400 text-sm hover:underline flex items-center justify-center"
          >
            ← Back
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ICP_TopUp2;
