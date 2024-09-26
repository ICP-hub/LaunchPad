import React, { useState } from "react";
import logo from "../../assets/images/icLogo.png";
import GradientText from "../../common/GradientText";
import { IoSearch, IoClose, IoMenu, IoCloseSharp } from "react-icons/io5";

import ConnectWallets from '../Modals/ConnectWallets';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuthClient';
import ProfileCard from '../Modals/ProfileCard';
import { FaUser } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import toast from "react-hot-toast";



const Header = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle hamburger menu
  const [isOpen, setIsOpen] = useState(false);
  const [profileModalIsOpen, setProfileModalIsOpen] = useState(false); // State for ProfileCard modal



  const { isAuthenticated, userPrincipal, identity } = useAuth();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  const openModal = () => {
    setModalIsOpen(true);
  };

  const openProfileModal = () => {
    setProfileModalIsOpen(true);
  };



  const handleSearchClick = () => {
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setIsSearching(false);
  };



  const [activeSection, setActiveSection] = useState("home");
  const [userDetails, setUserDetails] = useState(null);

  const getStatus = async () => {
    const getUser = await backendActor.getUser();
    if (getUser.err === "New user") {
      // navigate("/register");
    } else {
      console.log(getUser.ok);
      setUserDetails(getUser.ok);
      toast.success("You are registered");
    }
  };


  const handleSectionClick = (section) => {
    setActiveSection(section);
    setMenuOpen(false);
  };

  return (
    <div>

      <nav className="relative z-20 text-white bg-black shadow-lg dlg:px-[2%] dlg:py-6 lgx:px-[4%] 
      lgx:py-9 md:px-[4%] md:py-[2%] py-[3%] px-[2.5%] flex justify-between items-center">


        {/* Hamburger Menu for screens below 768px */}
        <div className="md:hidden flex  items-center">
          {menuOpen ? (
            <IoCloseSharp
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer"
              size={30}
            />
          ) : (
            <IoMenu
              onClick={() => setMenuOpen(true)}
              className="cursor-pointer"
              size={30}
            />
          )}
        </div>

        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className=" md:h-[18px] lg:h-[25px] lg:w-[150px] dlg:w-[170px] lg1:w-[160px] lgx:w-[220px] lgx:h-[30px] dxl:w-[190px] dxl:h-[30px]  "
            draggable="false"
          />
        </div>


        <div className="hidden  md:flex lgx:px-10 lgx:mr-[28%]  md:mr-[20%] lg:text-[18px] md:text-[13px] lgx:text-[20px] md:gap-[20px] lg:gap-[25px] dxl:gap-[50px]">

          <Link
            to="/"
            onClick={() => handleSectionClick('home')}
            className={`relative inline-block decoration-pink-400 underline-offset-8 ${activeSection === 'home' && (
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"></span>
              )
              }`}
          >
            {activeSection === 'home' ? (
              <GradientText>Home</GradientText>
            ) : (
              'Home'
            )}
            {activeSection === 'home' && (
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"></span>
            )}
          </Link>

          <Link
            to="/projects"
            onClick={() => handleSectionClick('project')}
            className={`relative inline-block   ${activeSection === 'project' && (
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"></span>
              )
              }`}
          >
            {activeSection === 'project' ? (
              <GradientText>Projects</GradientText>
            ) : (
              'Projects'
            )}
            {activeSection === 'project' && (
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"></span>
            )}
          </Link>

          <Link
            to="/LaunchCoin"
            onClick={() => handleSectionClick('coin')}
            className={`relative inline-block whitespace-nowrap decoration-pink-400 underline-offset-8 ${activeSection === 'coin' && (
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"></span>
              )
              }`}
          >
            {activeSection === 'coin' ? (
              <GradientText>Launch a Coin</GradientText>
            ) : (
              'Launch a Coin'
            )}
            {activeSection === 'coin' && (
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"></span>
            )}
          </Link>
        </div>

        <div className="relative flex items-center">


          <IoSearch
            onClick={handleSearchClick}
            className={`cursor-pointer ml-2 ${!isSearching ? "visible" : "invisible"}`}
            size={24}
          />


          {isSearching && (
            <div className="flex items-center absolute h-[35px] lg:mr-3 rounded-lg w-[80vw] right-0 md:w-[200px] md3:w-[230px] xl:w-[380px]  bg-[#222222] sm4:right-[23px] md:right-[-15px] lg:right-[-25px] dlg:right-[5px] md:py-[2px]">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                className="bg-transparent pl-3 w-full focus:outline-none text-white"
              />
              <IoClose
                onClick={handleClearSearch}
                className="text-gray-500 mr-2 cursor-pointer"
                size={24}
              />
            </div>
          )}
        </div>

        {/* Connect Wallet Button for screens above 768px */}

        {!isAuthenticated && <div className="hidden font-posterama md:block">

          <button
            onClick={openModal}
            className="w-[120px] md:w-[150px] lg:w-[190px] h-[25px] lg:h-[32px] 
            dxl:h-[35px] text-[10px] md:text-[15px] dlg:text-[19px] font-[400] rounded-xl p-[1.5px] bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"
          >
            <div className='bg-gray-950 w-full h-full  rounded-xl items-center justify-center '>
              Connect Wallet
            </div>
          </button>
          <ConnectWallets modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />
        </div>
        }


        {/* User Info */}
        {isAuthenticated &&
          <div className=" hidden md:inline-block relative  rounded-2xl bg-gradient-to-r  from-[#f09787] to-[#CACCF5] text-left p-[1.5px]">
            <button
              onClick={toggleDropdown}
              className="flex items-center text-white rounded-full"
            >
              <div className="bg-black h-full w-full rounded-2xl flex items-center p-1 px-3">
                <FaUser className="mr-2" />
                <div className="flex flex-col items-start w-24 lg:w-40">
                  <span className="text-sm">ABCD</span>
                  <span className="text-xs text-gray-400 w-full overflow-hidden whitespace-nowrap text-ellipsis">
                    {userPrincipal}
                  </span>
                </div>
                <BsThreeDotsVertical className="ml-2" />
              </div>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 font-posterama w-48 bg-[#222222] rounded-md z-50">
                <div className="py-2 px-2">
                  <div className="hidden border-b md:block">
                    <button
                      onClick={openProfileModal}
                      className="block px-4 py-2 text-[18px] "
                    >
                      Account
                    </button>
                    <ProfileCard profileModalIsOpen={profileModalIsOpen} setProfileModalIsOpen={setProfileModalIsOpen} />
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-[18px] border-b "  // Close dropdown on click
                  >
                    Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
        }


      </nav>

      {/* Dropdown Menu for screens below 768px */}
      {menuOpen && (

        <div className="md:hidden flex flex-col font-posterama justify-center items-center absolute z-20 bg-black w-full py-8 px-6 shadow-lg">
          <Link
            to="/"
            onClick={() => handleSectionClick('home')}
            className={`block py-4`}
          >
            Home
          </Link>
          <Link
            to="/projects"
            onClick={() => handleSectionClick('project')}
            className={`block py-4 `}
          >
            Projects
          </Link>
          <Link
            to="/LaunchCoin"
            onClick={() => handleSectionClick('coin')}
            className={`block py-4 `}

          >
            Launch a Coin
          </Link>

          {!isAuthenticated ? ""
            :
            <>
              <Link
                to="/profile"
                onClick={() => handleSectionClick('coin')}
                className={`block py-4 `}
              >
                Profile
              </Link>
            </>
          }
          {!isAuthenticated ? <button
            onClick={openModal}
            className=" mt-[80px]   bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]
             text-black  relative w-[220px] h-[35px] p-[1.5px]
                text-[16px] md:text-[18px] font-[600] rounded-3xl "
          >
            Connect Wallet
          </button>
            :
            <>          <button
              onClick={openProfileModal}
              className=" mt-[80px]   bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]
              relative w-[220px] h-[35px] p-[1.5px]
                text-[16px] md:text-[18px] font-[600] rounded-3xl "
            >
              <div className='bg-gray-950 w-full h-full  rounded-3xl items-center justify-center'>
                Account
              </div>
            </button>
              <ProfileCard profileModalIsOpen={profileModalIsOpen} setProfileModalIsOpen={setProfileModalIsOpen} />
            </>
          }

        </div>
      )}

      <div className="flex items-center bg-[#222222] py-1 px-[4%] md:text-[8px] md1:text-[10px] lg:text-[12px] lg:gap-4 lg1:gap-6 dlg:text-[14px] dxl:text-[15px] xl:text-[16px] md:gap-6 dxl:gap-8 gap-7 whitespace-nowrap">
        <p className="lg:text-[12px] dxl:text-lg">TRENDING</p>
        <p>#1 TRUMPBB</p>
        <p>#2 SWIF</p>
        <p>#3 MustPepe</p>
        <p>#4 MXD</p>
        <p>#5 BabyMAGA</p>
        <p>#6 BUTTERFLY</p>
        <p>#7 BAMBIT</p>
        <p>#8 MAGATRUMP</p>
        <p>#9 DOGA</p>
        <p>#10 MBCGA</p>
      </div>
    </div>
  );
};

export default Header;
