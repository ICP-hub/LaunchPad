import React, { useState } from 'react';
import Modal from 'react-modal';
import { TfiClose } from 'react-icons/tfi';

const ICP_TopUp1 = ({isTopUpModal1,setTopUpModal1,setTopUpModal2,topUpCansiter, setTopUpCansiter}) => {

  const [error,setError]=useState('');

  const closeModal = () => {
    setTopUpModal1(false);
  };

  const handleTopUpModal2=()=>{
    const canisterRegex = /^[a-z2-7]{5}(-[a-z2-7]{5}){3}-cai$/;
      
    if (!canisterRegex.test(topUpCansiter)) {
      setError('Invalid Canister ID.');
      return false;
    }
      setTopUpModal1(false);
      setTopUpModal2(true);
  }

  return (
    <div className="absolute">
      <Modal
        isOpen={isTopUpModal1}
        onRequestClose={closeModal}
        contentLabel="ICP Top-Up Modal"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50"
      >
        <div className="bg-[#222222] p-8 rounded-xl font-posterama text-white relative w-[400px]">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4  text-white text-2xl"
          >
            <TfiClose />
          </button>

          {/* Header */}
          <h1 className="text-xl font-semibold my-6 text-center">
            Which canisters would you like to top up?
          </h1>

          {/* Input Section */}
          <div className="flex flex-col items-center">
            <textarea
            value={topUpCansiter}
            onChange={(e)=>setTopUpCansiter(e.target.value)}
              className="w-full h-24 bg-[#333333] text-white rounded-lg p-4 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Paste your canister IDs here..."
            />


            {/* Continue Button */}
            <button disabled={topUpCansiter <= 0} onClick={handleTopUpModal2} className="mt-4 bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition">
              Continue
            </button>
          </div>
          <p className='text-center text-sm mt-6 text-red-600'>
            {error}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ICP_TopUp1;
