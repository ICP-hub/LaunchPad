import React, { useState } from 'react';
import Modal from 'react-modal';
import { TfiClose } from 'react-icons/tfi';
import { Principal } from '@dfinity/principal';
import { useSelector } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner';

const ICP_TopUp2 = ({
  isTopUpModal2,
  setTopUpModal2,
  setTopUpModal1,
  topUpCansiter,
}) => {
  const [icpToBurn, setIcpToBurn] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);
  const actor = useSelector((currState) => currState.actors.actor);
  const [loading, setLoading] = useState(false);

  const ICP_TO_CYCLES_CONVERSION = 10.0314; // Conversion rate

  const closeModal = () => setTopUpModal2(false);

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
    setTotalCycles((prev) => prev + ICP_TO_CYCLES_CONVERSION)
  };

  const handleDecrementCycles = () => {
    if(totalCycles > 0){
        setIcpToBurn((prev) => prev - 1);
        setTotalCycles((prev) => prev - ICP_TO_CYCLES_CONVERSION)
    } 
  };

  const handleBack = () => {
    setTopUpModal2(false);
    setTopUpModal1(true);
  };

  const handleInputChange = (e, type) => {
    const value = parseFloat(e.target.value) || 0;
    if (type === 'icp') {
      setIcpToBurn(value);
      setTotalCycles(value * ICP_TO_CYCLES_CONVERSION);
    } else if (type === 'cycles') {
      setTotalCycles(value);
      setIcpToBurn(value / ICP_TO_CYCLES_CONVERSION);
    }
  };


  const handleTopUpApprove = async () => {
    
    if (icpToBurn > 0) {
        setLoading(true)
      try {
        const ledgerPrincipal = Principal.fromText(topUpCansiter);
        // Convert totalCycles to an integer
        const cycleAmount = Math.floor(Number(totalCycles)); // Ensures it's an integer
 
        const response = await actor.obtain_cycles_for_canister(cycleAmount, ledgerPrincipal);
        console.log(response);
        if(response){
            setLoading(false)
            setTopUpModal2(false)
        }
      } catch (error) {
        console.error('Error in handleTopUpApprove:', error);
      }
    } else {
      console.error('ICP to burn must be greater than 0.');
    }
  };
  
  return (
    <div className="absolute">
      <Modal
        isOpen={isTopUpModal2}
        onRequestClose={closeModal}
        contentLabel="ICP Top-Up Modal"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50"
      >
        <div className="bg-[#222222] p-8 rounded-xl font-posterama text-white relative w-[400px]">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-2xl"
            aria-label="Close Modal"
          >
            <TfiClose />
          </button>

          {/* Header */}
          <h1 className="text-xl font-semibold mt-5 mb-6 text-center">
            How many cycles do you want to send?
          </h1>

          {/* Body */}
          <div className="bg-[#333333] rounded-lg p-4 mb-6">
            <div className="text-center text-gray-300 text-sm mb-8">
              {topUpCansiter}
            </div>

            {/* ICP to Burn Section */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">ICP to Burn</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDecrementIcp}
                  className="w-8 h-8 bg-[#444444] text-white rounded-lg flex items-center justify-center"
                  aria-label="Decrement ICP"
                >
                  -
                </button>
                <input
                  className="w-20 text-center no-spinner bg-[#222222] text-white border border-[#444444] rounded-lg"
                  value={icpToBurn}
                  onChange={(e) => handleInputChange(e, 'icp')}
                  type="number"
                  min="0"
                />
                <button
                  onClick={handleIncrementIcp}
                  className="w-8 h-8 bg-[#444444] text-white rounded-lg flex items-center justify-center"
                  aria-label="Increment ICP"
                >
                  +
                </button>
              </div>
              <span className="text-sm">ICP</span>
            </div>

            {/* Total Cycles Section */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Cycles</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleDecrementCycles()
                  }
                  className="w-8 h-8 bg-[#444444] text-white rounded-lg flex items-center justify-center"
                  aria-label="Decrement Cycles"
                >
                  -
                </button>
                <input
                  className="w-20 text-center bg-[#222222] no-spinner text-white border border-[#444444] rounded-lg"
                  value={totalCycles.toFixed(4)}
                  onChange={(e) => handleInputChange(e, 'cycles')}
                  type="number"
                  min="0"

                />
                <button
                  onClick={() =>
                    handleIncrementCycles()
                  }
                  className="w-8 h-8 bg-[#444444] text-white rounded-lg flex items-center justify-center"
                  aria-label="Increment Cycles"
                >
                  +
                </button>
              </div>
              <span className="text-sm">TC</span>
            </div>
          </div>

          {/* Approve Button */}
          <button onClick={handleTopUpApprove}  className="w-full flex justify-center items-center bg-green-500 hover:bg-green-600 text-black font-bold py-2 rounded-lg transition">
          {loading ? (
          <ThreeDots

            height="25"
            width="25"
            color="white"
            ariaLabel="loading-indicator"
          />
        ) : (
            'Approve Funds'
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
