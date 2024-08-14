import React, { useEffect, useState } from 'react';
import logo from '../../assets/images/icLogo.png';

import GradientText from '../../common/GradientText';
import AnimationButton from '../../common/AnimationButton';
import ConnectWallets from '../Modals/ConnectWallets';
import { IoSearch, IoClose } from "react-icons/io5";
import toast from "react-hot-toast";


const Header = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  function openModal() {
      setIsOpen(true);
  }
  
  
  const handleSearchClick = () => {
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchText('');
    setIsSearching(false);
  };

  const [activeSection, setActiveSection] = useState('home');
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
  };

  return (
    <div>
    <nav className="relative z-20 text-white bg-black shadow-lg px-[4%] py-9 flex justify-between items-center ">

      <div className="flex items-center">
        <img src={logo} alt="Logo" className="md:h-[50px] w-[132px] md:w-[167px] lg:w-[190px] lg:h-[40px]"  draggable="false" />
      </div>

      <div className="hidden px-10 mr-[35%]  md:flex space-x-11">
        <a
          href="#home"
          onClick={() => handleSectionClick('home')}
          className={`decoration-pink-400 underline-offset-8 ${activeSection === 'home' ? 'underline'  : 'decoration-transparent'}`}
        >
          <GradientText children="Home" />
        </a>
        <a
          href="#project"
          onClick={() => handleSectionClick('project')}
         
        >
          Projects
        </a>
        <a
          href="#coin"
          onClick={() => handleSectionClick('coin')}
        >
          Launch a Coin
        </a>
       
      </div>
      <div className=" overflow  relative flex items-center">
      {!isSearching && (
        <IoSearch
          onClick={handleSearchClick}
          className=" cursor-pointer"
          size={24}
        />
      )}
      {isSearching && (
        <div className="flex items-center absolute right-2 border border-gray-400 rounded bg-black px-2 mr-2">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search..."
            className="bg-transparent focus:outline-none text-white"
          />
          <IoClose
            onClick={handleClearSearch}
            className="text-gray-500 cursor-pointer "
            size={24}
          />
        </div>
      )}
    </div>
      <div>
        <AnimationButton onClick={openModal} text="CONNECT WALLET" />
        <ConnectWallets modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
      </div>
    </nav>
    <div className= ' flex items-center bg-[#222222] py-1 px-[4%] text-sm gap-11' >
    <p className='text-lg'>TRENDING</p>
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
