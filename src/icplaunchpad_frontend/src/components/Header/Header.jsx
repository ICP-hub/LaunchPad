import React, { useState } from 'react';
import logo from '../../assets/images/icLogo.png';
import GradientText from '../../common/GradientText';
import { IoSearch, IoClose } from "react-icons/io5";
import ConnectWallets from '../Modals/ConnectWallets';
import toast from "react-hot-toast";

const Header = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');

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
      <nav className="relative z-20 text-white bg-black shadow-lg   dlg:px-[2%] dlg:py-6 lgx:px-[4%] lgx:py-9 md:px-[4%] md:py-[2%] flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className=" md:h-[18px] lg:h-[25px]  lg:w-[170px] lgx:w-[190px] lgx:h-[30px]  "
            draggable="false"
          />
        </div>

        <div className="hidden lgx:px-10 lgx:mr-[35%] md:mr-[20%] md:flex lg:text-[18px] md:text-[13px] lgx:text-[20px] space-x-8">
  <a
    href="#home"
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
  </a>
  <a
    href="#project"
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
  </a>
  <a
    href="#coin"
    onClick={() => handleSectionClick('coin')}
    className={`decoration-pink-400 underline-offset-8 whitespace-nowrap ${
      activeSection === 'coin' ? 'underline' : 'decoration-transparent'
    }`}
  >
    {activeSection === 'coin' ? (
      <GradientText >Launch a Coin</GradientText>
    ) : (
      'Launch a Coin'
    )}
  </a>
</div>



        <div className="relative flex lg:px-6 items-center">
          {!isSearching && (
            <IoSearch
              onClick={handleSearchClick}
              className="cursor-pointer  "
              size={24}
            />
          )}
          {isSearching && (
            <div className="flex items-center absolute right-2 border border-gray-400 rounded bg-black lg:px-2 lg:mr-4 dxl:px-2 dxl:mr-2">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                className="bg-transparent focus:outline-none text-white"
              />
              <IoClose
                onClick={handleClearSearch}
                className="text-gray-500 cursor-pointer"
                size={24}
              />
            </div>
          )}
        </div>

        <div>
          <button
            onClick={openModal}
            className="border z-20 text-white relative w-[120px] md:w-[150px] lg:w-[190px] h-[25px] lg:h-[25px] dxl:h-[35px] text-[10px] md:text-[14px] font-[400] rounded-xl border-[#EE3EC9]"
          >
            Connect Wallet
          </button>
          <ConnectWallets modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
        </div>
      </nav>

      <div className="flex   items-center bg-[#222222] py-1 px-[4%] md:text-[6px] lg:text-[7px] dxl:text-[15px] md:gap-9  dxl:gap-11 whitespace-nowrap">
        <p className=" lg:text-[12px] dxl:text-lg">TRENDING</p>
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
