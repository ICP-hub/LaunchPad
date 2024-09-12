import React, { useState } from 'react';
import logo from '../../assets/images/icLogo.png';
import GradientText from '../../common/GradientText';
import { IoSearch, IoClose, IoMenu, IoCloseSharp } from "react-icons/io5";
import ConnectWallets from '../Modals/ConnectWallets';
import { Link } from 'react-router-dom';


const Header = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle hamburger menu

  const openModal = () => {
    setIsOpen(true);
  };

  const handleSearchClick = () => {
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchText('');
    setIsSearching(false);
  };

  const [activeSection, setActiveSection] = useState('home');

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setMenuOpen(false); // Close the menu after a section is clicked
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
            className={`decoration-pink-400 underline-offset-8 ${
              activeSection === 'home' ? 'underline' : 'decoration-transparent'
            }`}
          >
            {activeSection === 'home' ? (
              <GradientText>Home</GradientText>
            ) : (
              'Home'
            )}
          </Link>
          <Link
            to="/projects"
            onClick={() => handleSectionClick('project')}
            className={`decoration-pink-400 underline-offset-8 ${
              activeSection === 'project' ? 'underline' : 'decoration-transparent'
            }`}
          >
            {activeSection === 'project' ? (
              <GradientText>Projects</GradientText>
            ) : (
              'Projects'
            )}
          </Link>
          <Link
            to="/LaunchCoin"
            onClick={() => handleSectionClick('coin')}
            className={`decoration-pink-400 underline-offset-8 whitespace-nowrap ${
              activeSection === 'coin' ? 'underline' : 'decoration-transparent'
            }`}
          >
            {activeSection === 'coin' ? (
              <GradientText>Launch a Coin</GradientText>
            ) : (
              'Launch a Coin'
            )}
          </Link>
        </div>

        <div className="relative flex items-center">
          {!isSearching && (
            <IoSearch
              onClick={handleSearchClick}
              className="cursor-pointer"
              size={24}
            />
          )}
          {isSearching && (
            <div className="flex items-center absolute md:w-[200px] md3:w-[230px] lg1:w-[260px] lgx:w-[280px] xl:w-[380px] border border-gray-400 rounded bg-black sm4:right-[23px] md:right-[-15px] lg:right-[-25px] dlg:right-[5px] md:py-[2px] lg:py-1 px-[5px] lg:px-2 lg:mr-4 dxl:px-2 dxl:mr-1">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                className="bg-transparent focus:outline-none text-white"
              />
              <IoClose
                onClick={handleClearSearch}
                className="text-gray-500 cursor-pointer md:ml-[-8%] md2:ml-[-3%] md1:ml-[6%] lg:ml-[5%] lg1:ml-[17%] lgx:ml-[22%] xl:ml-[45%]"
                size={24}
              />
            </div>
          )}
        </div>

        {/* Connect Wallet Button for screens above 768px */}
        <div className="hidden md:block">
          <button
            onClick={openModal}
            className="border text-white w-[120px] md:w-[150px] lg:w-[190px] h-[25px] lg:h-[25px] dxl:h-[35px] text-[10px] md:text-[15px] dlg:text-[19px] font-[400] rounded-xl border-[#EE3EC9]"
          >
            Connect Wallet
          </button>
          <ConnectWallets modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
        </div>
      </nav>

      {/* Dropdown Menu for screens below 768px */}
      {menuOpen && (
        <div className="md:hidden flex flex-col font-posterama justify-center items-center absolute z-20 bg-black w-full py-8 px-6 shadow-lg">
          <Link
            to="/"
            onClick={() => handleSectionClick('home')}
            className={`block py-4 ${
              activeSection === 'home' ? 'text-pink-400' : 'text-white'
            }`}
          >
            Home
          </Link>
          <Link
            to="/project"
            onClick={() => handleSectionClick('project')}
            className={`block py-4 ${
              activeSection === 'project' ? 'text-pink-400' : 'text-white'
            }`}
          >
            Projects
          </Link>
          <Link
            to="/LaunchCoin"
            onClick={() => handleSectionClick('coin')}
            className={`block py-4 ${
              activeSection === 'coin' ? 'text-pink-400' : 'text-white'
            }`}
          >
            Launch a Coin
          </Link>
          <button
            onClick={openModal}
            className="border-1 mt-[80px]   bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] 
             text-black  relative w-[220px] h-[35px]
                text-[16px] md:text-[18px] font-[600] rounded-3xl"
          >
            Connect Wallet
          </button>
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
