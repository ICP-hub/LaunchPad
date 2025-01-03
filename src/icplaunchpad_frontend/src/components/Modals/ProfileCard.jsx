import React, { useState, useEffect } from 'react';
import { TfiClose } from "react-icons/tfi";

import Modal from 'react-modal';
import person1 from "../../../assets/images/carousel/user.png"
import { useSelector } from 'react-redux';
import { useAuths } from '../../StateManagement/useContext/useClient';
import CopyToClipboard from '../../common/CopyToClipboard';

const ProfileCard = ({ profileModalIsOpen, setProfileModalIsOpen, formattedIcpBalance }) => {
  const { logout } = useAuths();
  const principal = useSelector((currState) => currState.internet.principal);
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const [profileImg, setProfileImg] = useState();
  const UserData = useSelector((state) => state?.userData?.data);
  const profile_ImgId = useSelector((state) => state?.ProfileImageID?.data);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (profileModalIsOpen) {
      setIsVisible(true);
    }
  }, [profileModalIsOpen]);

  useEffect(() => {
    if(profile_ImgId)
     getProfileIMG(profile_ImgId);
  }, [profile_ImgId]);


async function getProfileIMG(profile_ImgId) {
  if (profile_ImgId?.Ok) { // Ensure profile_ImgId and Ok property are defined
    console.log('profile_iMGId', profile_ImgId);
    const imageUrl = `${protocol}://${canisterId}.${domain}/f/${profile_ImgId.Ok}`;
    setProfileImg(imageUrl);
    console.log("userImg-", imageUrl);
  } else {
    console.error("Invalid profile_ImgId:", profile_ImgId);
  }
}


  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  function closeModal() {
    setIsVisible(false);
    setTimeout(() => setProfileModalIsOpen(false), 300); // Ensure timing matches transition duration
  }

  return (
    <div>
      <Modal
        isOpen={profileModalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Profile Modal"
        className="fixed inset-0 flex items-center justify-center bg-transparent"
        overlayClassName={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
          }`}
        ariaHideApp={false} // For demo purposes; set to true in production
      >
        <div
          className={`bg-[#222222] p-6 rounded-xl font-posterama text-white relative transform transition-transform duration-300 ease-in-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
        >
          {/* Modal Header */}
          <div className='mx-[-24px] px-4 p-1 mb-4 rounded-2xl'>

            {/* Modal Close Button */}
            <button
              onClick={closeModal}
              className="absolute lg:right-8 right-4 top-[20px] text-[25px] text-white"
            >
              <TfiClose />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex items-center mt-4 gap-8">
            <img
              src={profileImg || person1}
              onError={(e) => (e.target.src = person1)}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="w-48 lg:w-64">
              <h2 className="text-lg font-semibold mt-2 mb-[1px]">
                {UserData ? UserData?.name : 'ABCD'}
              </h2>
              <p className="text-sm text-gray-400 overflow-hidden whitespace-nowrap text-ellipsis">
                <CopyToClipboard address={principal} width={'90%'} />
              </p>

              {/* User Tags */}
              <div className="flex w-[90%] overflow-x-scroll">
                {UserData
                  ? UserData?.tag?.map((tag, index) => (
                    <button
                      key={index}
                      className="bg-[#3c3c3c] mt-2 text-xs mx-1 text-gray-400 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </button>
                  ))
                  : (
                    <button className="bg-[#3c3c3c] mt-2 text-xs text-gray-400 px-3 py-1 rounded-full">
                      Block Explorer
                    </button>
                  )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-4 lg:mt-10">
            <div className="text-sm font-semibold border-b border-gray-600 py-2">
              ICP ${formattedIcpBalance}
            </div>
            <div className="text-sm font-semibold border-b border-gray-600 py-2">
              ACTIVITY
            </div>
            <div
              onClick={handleLogout}
              className="text-sm cursor-pointer font-semibold text-gray-400 border-b border-gray-600 py-2 mb-1"
            >
              DISCONNECT
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileCard;