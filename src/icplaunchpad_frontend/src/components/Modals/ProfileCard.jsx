import React from 'react';
import { TfiClose } from "react-icons/tfi";

import Modal from 'react-modal';
import person1 from "../../assets/images/carousel/person1.png"
import { useAuth } from '../../auth/useAuthClient';

const ProfileCard = ({ profileModalIsOpen, setProfileModalIsOpen }) => {
  const { logout, userPrincipal } = useAuth();

  async function handleLogout(){
      await logout().then(()=>window.location.reload())
  }
  function closeModal() {
    setProfileModalIsOpen(false);
  }

  return (
    <div className='mx-[50px]'>
      <Modal
        isOpen={profileModalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="fixed inset-0 flex items-center justify-center bg-transparent"
        overlayClassName="fixed z-[100] inset-0 bg-gray-800 bg-opacity-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#222222] p-6 rounded-xl font-posterama text-white  relative">
            <div className='mx-[-24px] px-4 p-1 mb-4 rounded-2xl'>
              
              {/* Modal Close Button */}
              <button
                onClick={closeModal}
                className="absolute right-8 top-[20px] text-[25px] text-white"
              >
                <TfiClose />
              </button>
            </div>
            

      {/* Profile Image */}
      <div className="flex  items-center mt-4 gap-8 ">
        <img
          src={person1}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
         <div className='w-48'>
        <h2 className="text-lg font-semibold mt-2">ABCD</h2>
        <p className="text-sm text-gray-400 overflow-hidden whitespace-nowrap text-ellipsis"> {userPrincipal} </p>

        {/* Block Explorer Button */}
        <button className="bg-[#3c3c3c] text-xs text-gray-400 px-3 py-1 mt-1 rounded-full">
          Block Explorer
        </button>
        </div>
      </div>

      {/* ICP, Activity, and Disconnect */}
      <div className="mt-4">
        <div className="text-sm font-semibold border-b border-gray-600 py-2">
          ICP
        </div>
        <div className="text-sm font-semibold border-b border-gray-600 py-2">
          ACTIVITY
        </div>
        <div onClick={handleLogout} className="text-sm cursor-pointer font-semibold text-gray-400 border-b border-gray-600 py-2 mb-1">
          DISCONNECT
        </div>
      </div>
            
           
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProfileCard;
