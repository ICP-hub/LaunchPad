import React, { useState } from 'react';
import logo from '../../assets/images/icLogo.png';
import infinite from '../../assets/images/icons/infinity.png';
import id from '../../assets/images/icons/id.png';
import stoic from '../../assets/images/icons/stoic.png';
import plug from '../../assets/images/icons/plug.png';
import bifinity from '../../assets/images/icons/bifinity.png';

import Modal from 'react-modal';

import { RxCross1 } from "react-icons/rx";

import toast from 'react-hot-toast';
import AnimationButton from '../../common/AnimationButton';
const JoinWaitlist = ({ modalIsOpen, setIsOpen }) => {
  
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="fixed  inset-0 flex items-center lg:mb-[60%] lgx:mb-[10%] justify-center bg-transparent"
        overlayClassName="fixed z-[100] inset-0 bg-gray-800 bg-opacity-50"
      >
        <div className='bg-[#222222] p-[15px] md:p-[20px] relative w-[80%] md:w-[440px] border border-[#696969] rounded-xl'>
        
          <p className='text-start text-white font-bold mt-4 md:mt-0 text-sm md:text-lg lg:text-xl lg1:text-2xl'> CONNECT WALLET </p>
          

          <div className='w-full md:w-auto mt-8 md:mt-0'>
            <button
              onClick={closeModal}
              className="text-white absolute top-6 right-6"
            >
              <RxCross1 />
            </button>
            <div className="w-[90%] mx-auto mt-5 flex flex-col  pt-5 justify-center ">
             
            <div className="mb-4">
                <button onClick={()=>login("plug")} className="w-full bg-[#303030] text-white py-2 rounded-[10px] flex items-center">
                  
                  <span className="ml-3 absolute">Internet Identity</span>
                  <div className="flex items-center justify-center  ml-[85%] py-2 px-2 bg-white rounded-full">
                    <img src={infinite} alt="infinite" className="w-4 py-1" />
                  </div>
                </button>
              </div>
              
              <div className="mb-4">
                <button onClick={()=>login("plug")} className="w-full bg-[#303030] text-white py-2 rounded-[10px] flex items-center">
                  
                  <span className="ml-3">Plug</span>
                  <div className="flex items-center justify-center  ml-[73%] py-2 px-2 bg-white rounded-full">
                    <img src={plug} alt="plug" className="w-4" />
                  </div>
                </button>
              </div>
              
              <div className="mb-4">
                <button onClick={()=>login("plug")} className="w-full bg-[#303030] text-white py-2 rounded-[10px] flex items-center">
                  
                  <span className="ml-3 absolute">Bifinity</span>
                  <div className="flex items-center justify-center  ml-[85%] py-2 px-2 bg-white rounded-full">
                    <img src={bifinity} alt="stoic" className="w-4 " />
                  </div>
                </button>
              </div>

              <div className="mb-4">
                <button onClick={()=>login("nfid")} className="w-full bg-[#303030] text-white py-2 rounded-[10px] flex items-center">
                  
                  <span className="ml-3 absolute">NFID</span>
                  <div className="flex items-center justify-center  ml-[85%] py-2 px-2 bg-white rounded-full">
                    <img src={id} alt="nfid" className="w-4 " />
                  </div>
                </button>
              </div>

            </div>

          </div>
        </div>
      </Modal>
    </div>
  );
}

export default JoinWaitlist;
