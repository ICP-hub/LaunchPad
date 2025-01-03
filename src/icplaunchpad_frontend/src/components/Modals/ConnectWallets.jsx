
// import React from 'react';
// import Modal from 'react-modal';
// import { useAuth } from '../../StateManagement/useContext/useAuth'
// // import { useAuth } from '../../auth/useAuthClient';
// import { RxCross1 } from "react-icons/rx";

// // Importing wallet icons
// import infinite from '../../../assets/images/icons/infinite.png';
// import id from '../../../assets/images/icons/id.png';
// import plug from '../../../assets/images/icons/plug.png';
// import bifinity from '../../../assets/images/icons/bifinity.png';

// // Component to connect wallet using various providers
// const ConnectWallet = ({ modalIsOpen, setModalIsOpen }) => {
//    const {
//     authenticateWithWallet,
//      isAuthenticated,
//      actor
//   //    createCustomActor,
//    } = useAuth(); 

//    console.log('actor',actor)
//    // Handle login for different wallet options
//    const handleLogin = async (loginOption) => {
//     try {
//       switch (loginOption) {
//         case "Icp":
//           await authenticateWithWallet("II"); // Internet Identity
//           break;
//         case "Plug":
//           await authenticateWithWallet("Plug"); // Plug Wallet
//           break;
//         case "Nfid":
//           await authenticateWithWallet("NFID"); // NFID
//           break;
//         default:
//           console.log("Unknown login option");
//       }
//       setModalIsOpen(false);
//     } catch (e) {
//       console.error("Error while connecting:", e);
//     }
//   };
  
//   // Close modal handler
//   const closeModal = () => {
//     setModalIsOpen(false);
//   };

//   // Render wallet options as buttons
//   const WalletButton = ({ onClick, label, icon }) => (
//     <div className="mb-4">
//       <button
//         onClick={onClick}
//         className="w-full bg-[#303030] text-white py-2 rounded-[10px] flex items-center"
//       >
//         <span className="ml-3 absolute">{label}</span>
//         <div className="flex items-center justify-center ml-[85%]  bg-white rounded-full">
//           <img src={icon} alt={label} className="w-8 h-8" />
//         </div>
//       </button>
//     </div>
//   );


//   return (
//     <div>
//       <Modal
//         isOpen={modalIsOpen}

//         onRequestClose={closeModal}
//         contentLabel="Connect Wallet"
//         className="fixed inset-0 flex items-center justify-center bg-transparent"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"
//       >
//         <div className="bg-[#222222] p-[15px] md:p-[20px] relative w-[80%] md:w-[440px] border border-[#696969] rounded-xl">
          
//           <p className="text-start text-white font-bold mt-4 text-sm md:text-lg lg:text-xl">CONNECT WALLET</p>

//           <button
//             onClick={closeModal}
//             className="text-white absolute top-6 right-6"
//           >
//             <RxCross1 />
//           </button>

//           <div className="w-[90%] mx-auto mt-5 flex flex-col pt-5 justify-center">
//             {/* Internet Identity Login */}
//             <WalletButton
//               onClick={() => handleLogin("Icp")}
//               label="Internet Identity"
//               icon={infinite}
//             />

//             {/* Plug Wallet Login */}
//             <WalletButton
//               onClick={() => handleLogin("Plug")}
//               label="Plug"
//               icon={plug}
//             />

//             {/* NFID Login */}
//             <WalletButton
//               onClick={() => handleLogin("Nfid")}
//               label="NFID"
//               icon={id}
//             />

//           </div>

//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default ConnectWallet;

import React from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { RxCross1 } from "react-icons/rx";
import { PiWalletBold } from "react-icons/pi";
// Import wallet icons
import infinite from '../../../assets/images/icons/infinite.png';
import id from '../../../assets/images/icons/id.png';
import plug from '../../../assets/images/icons/plug.png';

// import {
//   ConnectWallet,
// } from "@nfid/identitykit/react";

// Custom Button component
const ConnectBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full rounded-full text-white font-semibold bg-black border border-black px-4 py-2 mb-3 flex justify-center items-center gap-1.5"
  >
    <PiWalletBold className="w-5 h-5" /> Connect Your Wallet
  </button>
);

const ConnectWallets = ({ modalIsOpen, setModalIsOpen }) => {


 

  // Close modal handler
  const closeModal = () => setModalIsOpen(false);


  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Connect Wallet"
        className="fixed inset-0 flex items-center justify-center bg-transparent"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"
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
           

            {/* <ConnectWallet
              connectButtonComponent={ConnectBtn}
              className="rounded-full bg-black"
            /> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConnectWallets;
