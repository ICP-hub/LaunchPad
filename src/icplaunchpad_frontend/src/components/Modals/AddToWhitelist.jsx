import React, { useState } from 'react';
import { TfiClose } from "react-icons/tfi";
import { Link } from 'react-router-dom';

import Modal from 'react-modal';


const AddToWhitelist = ({ modalIsOpen, setIsOpen }) => {
  
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div >
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="fixed  inset-0 flex items-center  lg:mb-[60%] lgx:mb-[10%] justify-center bg-transparent "
        overlayClassName="fixed z-[100] inset-0 bg-opacity-50"
      >
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center  z-50">
      <div className="bg-[#222222] p-6 mx-16 ss2:mx-4 rounded-xl  text-white h-[400px] sm:h-[670px] w-[786px] relative">
        <div className='mx-[-24px] gap-4 flex px-4 p-1  mb-4 rounded-2xl'>
        <h2 className=" text-[18px] sm:text-[25px] Text-[#FFFFFFA6] font-posterama ">ADD USERS TO WHITELIST</h2>
        {/* Modal Close Button */}
        <button
          onClick={closeModal}
          className="absolute right-4 sm:right-8 sm:top-[20px] text-[20px] sm:text-[30px]   text-white"
        >
          <TfiClose />
        </button>
        </div>
        <div className=' h-[200px] sm:h-[500px] rounded-2xl w-full bg-[#313030]'>
                <textarea
            className='w-full h-full bg-[#313030] border-none p-4 resize-none text-white rounded-2xl outline-none'
            
          />
        </div>

         {/* Gradient Button */}
         <div className='flex justify-center py-4 items-center'>
          <Link to="/verify-token">
        <button className='border-1  font-posterama  bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] 
             text-black  relative w-[250px] h-[35px] md:h-[40px] 
                text-[16px] md:text-[18px] font-[600] rounded-3xl'>Add to whitelist</button>
      </Link>
      </div>
      </div>
    </div>
      </Modal>
    </div>
  );
}

export default AddToWhitelist;
