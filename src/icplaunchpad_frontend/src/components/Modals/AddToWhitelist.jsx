import React, { useState } from 'react';
import { TfiClose } from "react-icons/tfi";
import { Link } from 'react-router-dom';

import Modal from 'react-modal';
import AnimationButton from '../../common/AnimationButton';

const AddToWhitelist = ({ modalIsOpen, setIsOpen }) => {
  
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
      <div className="bg-[#222222] p-6 rounded-xl font-posterama text-white w-[786px] relative">
        <div className=' mx-[-24px]  px-4 p-1  mb-4 rounded-2xl'>
        <h2 className="text-[25px] Text-[#FFFFFFA6]  ">ADD USERS TO WHITELIST</h2>
        {/* Modal Close Button */}
        <button
          onClick={closeModal}
          className="absolute  right-8 top-[20px] text-[30px]   text-white"
        >
          <TfiClose />
        </button>
        </div>
        <div className=' h-[500px] rounded-2xl w-full bg-[#313030]'>
        </div>

         {/* Gradient Button */}
         <div className='flex justify-center py-4 items-center'>
          <Link to="/verify-token">
        <AnimationButton text="ADD USER TO WHITELIST" />
      </Link>
      </div>
      </div>
    </div>
      </Modal>
    </div>
  );
}

export default AddToWhitelist;
