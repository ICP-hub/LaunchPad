import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { TfiClose } from "react-icons/tfi";
import AnimationButton from "../../common/AnimationButton";

const ICP_TopUp1 = ({
  isTopUpModal1,
  setTopUpModal1,
  setTopUpModal2,
  topUpCansiter,
  setTopUpCansiter,
}) => {
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setTopUpModal1(false), 300); // Match transition duration
  };

  const handleTopUpModal2 = () => {
    setError('')
    const canisterRegex = /^[a-z2-7]{5}(-[a-z2-7]{5}){3}-cai$/;

    if (!canisterRegex.test(topUpCansiter)) {
      setError("Invalid Canister ID.");
      return false;
    }
    setIsVisible(false);
    setTimeout(() => {
      setTopUpModal1(false);
      setTopUpModal2(true);
    }, 300);
  };

  useEffect(() => {
    if (isTopUpModal1) {
      setIsVisible(true);
    }
  }, [isTopUpModal1]);

  return (
    <div>
      <Modal
        isOpen={isTopUpModal1}
        onRequestClose={closeModal}
        contentLabel="ICP Top-Up Modal"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300"
      >
        <div
          className={`bg-[#222222] p-6 rounded-xl font-posterama text-white relative w-[90%] max-w-[400px] transform transition-all duration-300 ${
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
          <h1 className="text-lg font-semibold my-6 text-center">
            Which canister would you like to top up?
          </h1>

          {/* Input Section */}
          <div className="flex flex-col items-center">
            <textarea
              value={topUpCansiter}
              onChange={(e) => setTopUpCansiter(e.target.value)}
              className="w-full border-b-2 bg-[#333333] text-white rounded-lg p-4 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#f09787]  h-32 resize-none"
              placeholder="Paste your canister ID here..."
            />
            {/* Error Message */}
            {error && (
              <p className="text-center text-sm mt-3 text-red-600">{error}</p>
            )}
            {/* Continue Button */}
            <div
              onClick={handleTopUpModal2}
              className="my-4 "
            >
               <AnimationButton text="Continue" isDisabled={!topUpCansiter || topUpCansiter.trim().length === 0} />
            </div>
          
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ICP_TopUp1;
