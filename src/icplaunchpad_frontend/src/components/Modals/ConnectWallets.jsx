
import React from 'react';
import Modal from 'react-modal';
import { useAuth } from "../../auth/useAuthClient";
import { RxCross1 } from "react-icons/rx";

// Importing wallet icons
import infinite from '../../../assets/images/icons/infinite.png';
import id from '../../../assets/images/icons/id.png';
import plug from '../../../assets/images/icons/plug.png';
import bifinity from '../../../assets/images/icons/bifinity.png';

// Component to connect wallet using various providers
const ConnectWallet = ({ modalIsOpen, setModalIsOpen }) => {
  const { login } = useAuth(); // Hook to handle authentication

  // Handle login for different wallet options
  const handleLogin = async (loginOption) => {
    try {
      await login(loginOption).then(() => console.log("Connected"));
    } catch (e) {
      console.error('Error while connecting:', e);
    }
  };

  // Close modal handler
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Render wallet options as buttons
  const WalletButton = ({ onClick, label, icon }) => (
    <div className="mb-4">
      <button
        onClick={onClick}
        className="w-full bg-[#303030] text-white py-2 rounded-[10px] flex items-center"
      >
        <span className="ml-3 absolute">{label}</span>
        <div className="flex items-center justify-center ml-[85%]  bg-white rounded-full">
          <img src={icon} alt={label} className="w-8" />
        </div>
      </button>
    </div>
  );


  return (
    <div>
      <Modal
        isOpen={modalIsOpen}

        onRequestClose={closeModal}
        contentLabel="Connect Wallet"
        className="fixed inset-0 flex items-center justify-center bg-transparent"
        overlayClassName="fixed z-[100] inset-0 bg-gray-800 bg-opacity-50"
      >
        <div className="bg-[#222222] p-[15px] md:p-[20px] relative w-[80%] md:w-[440px] border border-[#696969] rounded-xl">
          
          <p className="text-start text-white font-bold mt-4 text-sm md:text-lg lg:text-xl">CONNECT WALLET</p>

          <button
            onClick={closeModal}
            className="text-white absolute top-6 right-6"
          >
            <RxCross1 />
          </button>

          <div className="w-[90%] mx-auto mt-5 flex flex-col pt-5 justify-center">
            {/* Internet Identity Login */}
            <WalletButton
              onClick={() => handleLogin("Icp")}
              label="Internet Identity"
              icon={infinite}
            />

            {/* Plug Wallet Login */}
            <WalletButton
              onClick={() => handleLogin("Plug")}
              label="Plug"
              icon={plug}
            />

            {/* Bifinity Wallet Login */}
            <WalletButton
              onClick={() => handleLogin("Icp")}
              label="Bifinity"
              icon={bifinity}
            />

            {/* NFID Login */}
            <WalletButton
              onClick={() => handleLogin("Nfid")}
              label="NFID"
              icon={id}
            />

          </div>

        </div>
      </Modal>
    </div>
  );
};

export default ConnectWallet;
