import React, { useState } from 'react';
import { TfiClose } from "react-icons/tfi";
import { Link } from 'react-router-dom';

import Modal from 'react-modal';
import AnimationButton from '../../common/AnimationButton';

const CreateTokenModal = ({ modalIsOpen, setIsOpen }) => {
  
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className='mx-[50px]'>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="fixed  inset-0 flex items-center lg:mb-[60%] lgx:mb-[10%] justify-center bg-transparent "
        overlayClassName="fixed z-[100] inset-0 bg-gray-800 bg-opacity-50"
      >
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#222222] p-6 rounded-md text-white w-[786px] relative">
        <div className='bg-[#FFFFFF4D] mx-[-24px] mt-[-25px] px-4 p-1 mb-4 rounded-2xl'>
        {/* Modal Close Button */}
        <button
          onClick={closeModal}
          className="absolute  right-8 text-[30px]  text-white"
        >
          <TfiClose />
        </button>

        <h2 className="text-[25px] font-semibold ">Create Token</h2>
        </div>
        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-[18px]">Name</label>
            <input
              type="text"
              className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              
            />
            <small className="block text-[#cccccc] ml-6 mt-1">
              Creation Fee: 0.4 BNB
            </small>
          </div>

          <div>
            <label className="block mb-2 text-[18px]">Symbol</label>
            <input
              type="text"
              className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              
            />
          </div>

          <div>
            <label className="block mb-2 text-[18px]">Decimals</label>
            <input
              type="text"
              className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
             
            />
          </div>

          <div>
            <label className="block mb-2 text-[18px]">Total Supply</label>
            <input
              type="number"
              className="w-full p-2 bg-[#444444] text-white rounded-3xl border-b-2 outline-none"
              
            />
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-center mt-4 mb-6">
          <input
            type="checkbox"
            className="form-checkbox text-pink-600 bg-[#444444] rounded-md mr-2"
          />
          <p className="text-[15px] text-[#cccccc]">
            Lorem ipsum dolor sit amet consectetur. Sit penatibus lacus neque
            sagittis ut enim eget in. Sed massa eget eros posuere rutrum sed.
          </p>
        </div>

         {/* Gradient Button */}
         <div className='flex justify-center items-center'>
          <Link to="/verify-token">
        <AnimationButton text="CREATE TOKEN" />
      </Link>
      </div>
      </div>
    </div>
      </Modal>
    </div>
  );
}

export default CreateTokenModal;
