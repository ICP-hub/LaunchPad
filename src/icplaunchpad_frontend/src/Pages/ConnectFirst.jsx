import React, { useState } from 'react';
import AnimationButton from '../common/AnimationButton';
import { Link } from 'react-router-dom';
// Importing wallet icons
import infinite from '../../assets/images/icons/infinite.png';
import id from '../../assets/images/icons/id.png';
import plug from '../../assets/images/icons/plug.png';

const ConnectFirst = () => {

  const [modalIsOpen, setIsOpen] = useState(false);

   // Render wallet options as buttons
   const WalletButton = ({ onClick, label, icon }) => (
    <div className="mb-4 ">
      <button
        onClick={onClick}
        className="    text-white py-2 mb-8 rounded-[10px] flex flex-col items-center"
      >
        <div className=" items-center justify-center  bg-white rounded-full">
          <img src={icon} alt={label} className="w-12 " />
        </div>
        <span className="mt-14  absolute">{label}</span>
      </button>
    </div>
  );

  
  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex justify-center items-center  bg-black text-white">
      <div className="w-full max-w-[1070px] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold text-start font-posterama mb-6">CREATE PRELAUNCH</h1>

        <div className="bg-[#222222] p-4 rounded-2xl">
          {/* Chain Text with Gray Background */}
          <div className="flex items-center mb-8 bg-[rgb(68,68,68)] p-2 mt-[-15px] mx-[-15px] rounded-2xl">
            <span className="text-white text-[20px]">Chain</span>
          </div>
        
          <div className="w-[90%] mx-auto mt-5 flex pl-4  flex-row  items-center justify-between mb-[5%]">
            {/* Internet Identity Login */}
            <WalletButton
              onClick={() => handleLogin("Icp")}
              label="Internet Identity"
              icon={infinite}
            />

            {/* Plug Wallet Login */}
            <WalletButton
              onClick={() => handleLogin("Plug")}
              icon={plug}
              label="Plug"
            />

            {/* NFID Login */}
            <WalletButton
              onClick={() => handleLogin("Nfid")}
              label="NFID"
              icon={id}
            />

          </div>
         

          {/* Gradient Button */}
          <div className='flex justify-center items-center'>
          <button type='submit' className='border-1  font-posterama  bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] 
             text-black  relative w-[250px] h-[35px] md:h-[40px] 
                text-[16px] md:text-[18px] font-[600] rounded-3xl'>
                Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectFirst;
