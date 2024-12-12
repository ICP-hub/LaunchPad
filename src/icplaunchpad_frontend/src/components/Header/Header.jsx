
import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/icLogo.png";
import GradientText from "../../common/GradientText";
import { IoSearch, IoClose, IoMenu, IoCloseSharp } from "react-icons/io5";

import ConnectWallets from "../Modals/ConnectWallets";
import { Link, useNavigate } from "react-router-dom";
import ProfileCard from "../Modals/ProfileCard";
import { FaUser } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import icp from "../../../assets/images/icp.png"
import CreateUser from "../Modals/CreateUser";
import { Principal } from "@dfinity/principal";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "../../Redux-Config/ReduxSlices/UserSlice";
import UpdateUser from "../Modals/UpdateUser";
import { userRegisteredHandlerRequest } from "../../StateManagement/Redux/Reducers/userRegisteredData";
import { useAuths } from "../../StateManagement/useContext/useClient";
import { ConnectWallet, useBalance, useIdentityKit } from "@nfid/identitykit/react";
import person1 from "../../../assets/images/carousel/user.png"
const ConnectBtn = ({ onClick }) => (

  <button
    onClick={onClick}
    className="w-[120px] md:w-[150px] lg:w-[190px] h-[25px] lg:h-[32px] 
        dxl:h-[35px] text-[10px] md:text-[15px] dlg:text-[19px] font-[400] items-center justify-center  rounded-xl p-[1.5px] bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"
  >
    <div className="bg-gray-950 w-full h-full  rounded-xl flex items-center justify-center ">
      Connect Wallet
    </div>
  </button>
);
const Header = () => {

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userModalIsOpen, setUserModalIsOpen] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [userUpdateIsOpen, setUserUpdateIsOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [tokenData, setTokenData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle hamburger menu
  const [isOpen, setIsOpen] = useState(false);
  const [profileModalIsOpen, setProfileModalIsOpen] = useState(false); // State for ProfileCard modal


  const [activeSection, setActiveSection] = useState("home");
  const [isUserRegistered, setUserRegister] = useState(null);
  // const [userData, setUserData] = useState(null);
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const [profileImg, setProfileImg] = useState();

  const { isAuthenticated, principal, actor } = useAuths();
  const userData = useSelector((state) => state?.userData?.data);
  const navigate = useNavigate();
  const profile_ImgId = useSelector((state) => state?.ProfileImageID?.data)
  const { balance, fetchBalance } = useBalance()


  useEffect(() => {
    if (isAuthenticated) {
      userCheck();
    }
  }, [isAuthenticated]);

  async function userCheck() {
    try {
      // Check if actor is defined
      if (actor) {
        const response = await actor.is_account_created();
        console.log("Account creation response:", response);
        const resultResponse = response.slice(-16);
        if (resultResponse === "already created.") {
          setUserRegister(true);

        } else {
          setUserRegister(false);
          console.log("User account has not been created yet.");
        }
      }
    } catch (error) {
      console.error("Specific error occurred:", error.message); // Handle specific known errors
    }
  }


  //fetch profile image  
  useEffect(() => {
    getProfileIMG();
  }, [profile_ImgId])

  async function getProfileIMG() {
    if (profile_ImgId) {
      // console.log('profile_iMGId', profile_ImgId)
      const imageUrl = `${protocol}://${canisterId}.${domain}/f/${profile_ImgId.Ok}`;
      setProfileImg(imageUrl);
      // console.log("userImg-", imageUrl);
    }
    else {
      setProfileImg(null);
      console.log("No profile image found, using default.");
    }
  }

// Function to fetch token data based on the search field
const handleFetchToken = async () => {
  setTokenData(null); // Clear previous token data

  try {
    // Proceed only if the user is authenticated and searchText is non-empty
    if (isAuthenticated && searchText.trim().length > 0) {
      const searchTextLower = searchText.toLowerCase().trim();

      // Fetch token data by name or symbol
      const data = await actor.search_by_token_name_or_symbol(searchTextLower);
      console.log("Token searched data=", data);

      if (data?.Ok) {
        const ledgerPrincipal = Principal.fromText(data.Ok.canister_id);

        // Fetch sale details for the token
        const saleDetails = await actor.get_sale_params(ledgerPrincipal);
        console.log("Token searched saleDetails=", saleDetails);

        // Update token data if sale details are available
        if (saleDetails?.Ok) {
          setTokenData(data.Ok);
        } else {
          setTokenData(null);
        }
      } else {
        setTokenData(null); // No data found
      }
    }
  } catch (err) {
    console.error("Error fetching token data:", err);
  }
};

  const handleSearchedToken = async (data) => {
    // console.log('searched data', data)

    if (data.canister_id) {
      const ledgerPrincipal = Principal.fromText(data.canister_id);

      // Fetch token image ID
      const tokenImgId = await actor.get_token_image_id(ledgerPrincipal);
      console.log("Fetched token image ID:", tokenImgId);
      const saleParams = await actor.get_sale_params(ledgerPrincipal);

      if (tokenImgId && tokenImgId.length > 0) {
        const imageUrl = `${protocol}://${canisterId}.${domain}/f/${tokenImgId[tokenImgId.length - 1]}`;
        console.log("Token Image URL:", imageUrl);

        const creator = saleParams?.Ok?.creator;
        navigate(creator == principal ? '/token-page' : '/project', { state: { projectData: { ...data, token_image: imageUrl } } });
      }
      else {
        const creator = saleParams?.Ok?.creator;
        navigate(creator == principal ? '/token-page' : '/project', { state: { projectData: { ...data } } });
      }
    }
  }


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const openModal = () => { //used for connect wallet
    setModalIsOpen(true);
  };

  const openProfileModal = () => { //for profile card
    setProfileModalIsOpen(true);
  };

  const openUserModal = () => {  //for update modal
    setUserUpdateIsOpen(true);
  };

  const handleSearchClick = () => {
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setTokenData("")
    setIsSearching(false);
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setMenuOpen(false);
    setIsOpen(false);
  };


  const formattedIcpBalance =
    balance !== undefined ? Number(balance).toFixed(5) : "Fetching...";

  return (
    <div>
      {isAuthenticated && isUserRegistered === false && (
        <CreateUser
          userModalIsOpen={userModalIsOpen}
          setUserModalIsOpen={setUserModalIsOpen}
        />
      )}
      <nav
        className="relative z-20 text-white bg-black shadow-lg dlg:px-[2%] dlg:py-6 lgx:px-[4%] 
      lgx:py-9 md:px-[4%] md:py-[2%] py-[3%] px-[2.5%] flex justify-between items-center"
      >
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
            alt="Internet Identity"
            className=" h-[20px]  ss2:h-[24px] md:h-[25px] lg:w-[150px] dlg:w-[170px] lg1:w-[160px] lgx:w-[220px] lgx:h-[30px] dxl:w-[190px] dxl:h-[30px]  "
            draggable="false"
          />
        </div>

        <div className="hidden  ml-2 md:flex lgx:px-10 lgx:mr-[28%]  md:mr-[20%] lg:text-[18px] md:text-[17px] lgx:text-[20px] md:gap-[20px] lg:gap-[25px] dxl:gap-[50px]">
          <Link
            to="/"
            onClick={() => handleSectionClick("home")}
            className={`relative inline-block decoration-pink-400 underline-offset-8 ${activeSection === "home" && (
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"></span>
            )
              }`}
          >
            {activeSection === "home" ? (
              <GradientText>Home</GradientText>
            ) : (
              "Home"
            )}
            {activeSection === "home" && (
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"></span>
            )}
          </Link>

          <Link
            to="/projects"
            onClick={() => handleSectionClick("project")}
            className={`relative inline-block   ${activeSection === "project" && (
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"></span>
            )
              }`}
          >
            {activeSection === "project" ? (
              <GradientText>Projects</GradientText>
            ) : (
              "Projects"
            )}
            {activeSection === "project" && (
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"></span>
            )}
          </Link>

          <Link
            to="/LaunchCoin"
            onClick={() => handleSectionClick("coin")}
            className={`relative inline-block whitespace-nowrap decoration-pink-400 underline-offset-8 ${activeSection === "coin" && (
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"></span>
            )
              }`}
          >
            {activeSection === "coin" ? (
              <GradientText>Launch a Coin</GradientText>
            ) : (
              "Launch a Coin"
            )}
            {activeSection === "coin" && (
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"></span>
            )}
          </Link>
        </div>

        <div className="relative flex items-center">
          <IoSearch
            onClick={handleSearchClick}
            className={`cursor-pointer mr-2  ${!isSearching ? "visible" : "invisible"
              }`}
            size={24}
          />
          <div
            className={`-mt-8 transition-all duration-300 transform ${isSearching
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
              }`}>
            <div className="flex items-center absolute h-[35px]  lg:mr-3 rounded-lg w-[80vw] right-0 md:w-[155px] lg:w-[220px] xl:w-[380px]  bg-[#222222] sm4:right-[10px] lg:right-[-20px] dlg:right-[0px] md:py-[2px]">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFetchToken(); // Call the function when "Enter" is pressed
                  }
                }}
                className="bg-transparent pl-3 w-full focus:outline-none text-white"
              />

              <IoClose
                onClick={handleClearSearch}
                className="text-gray-500 mr-2 cursor-pointer"
                size={24}
              />
            </div>

            {tokenData && <div className=" py-1 flex items-center justify-center   absolute min-h-[25px] border-2 border-[#f3b3a7] lg:mr-3 rounded-lg w-[80vw] top-10 right-0 md:w-[155px] lg:w-[220px] xl:w-[380px]  bg-[#222222] sm4:right-[12px] lg:right-[-20px] dlg:right-[0px] md:py-[2px] ">
              <h1 className="my-1 cursor-pointer w-full h-full text-center" onClick={() => handleSearchedToken(tokenData)}> {tokenData.token_name} </h1>
            </div>
            }
          </div>

        </div>


        {/* Connect Wallet Button for screens above 768px */}

        {!isAuthenticated && (
          <div className="hidden font-posterama md:block">

            <ConnectWallet
              connectButtonComponent={ConnectBtn}
              className="rounded-full bg-black"
            />
          </div>
        )}

        {/* User Info */}
        {isAuthenticated && (
          <div className=" hidden md:inline-block relative  rounded-2xl bg-gradient-to-r  from-[#f09787] to-[#CACCF5] text-left p-[1.5px]">
            <button
              onClick={userData && toggleDropdown}
              className="flex items-center text-white rounded-full"
            >
              <div className="bg-black h-full w-full rounded-2xl flex items-center p-1 px-3">
                <img src={profileImg || person1} onError={(e) => (e.target.src = person1)} alt="profile-img" className="h-7 w-7 rounded-full object-cover mr-2 " />
                <div className="flex flex-col items-start w-24 h-8 lg:w-40 lg:h-full ">
                  <span className="text-sm">
                    {userData ? userData?.username : ""}
                  </span>
                  <span className=" text-[10px] lg:text-xs text-gray-400 w-full overflow-hidden whitespace-nowrap text-ellipsis">
                    {principal}
                  </span>
                </div>
                <BsThreeDotsVertical className="ml-2" />
              </div>
            </button>

            {/* Dropdown menu */}

            <div
              className={`absolute right-0 mt-2 font-posterama w-48 bg-[#222222] rounded-md z-50 transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
                }`}
            >
              <div className="py-2 px-2 text-center">
                <div className="hidden border-b w-full md:block">
                  <div className="block py-2 text-[18px]">
                    {balance !== undefined ? (
                      <span className="flex items-center justify-center gap-2">
                        <img src={icp} alt="" className="h-6" />${balance} ICP
                      </span>
                    ) : (
                      "Fetching your balance..."
                    )}
                  </div>
                </div>
                <div className="hidden border-b md:block">
                  <button
                    onClick={openProfileModal}
                    className="block hover:text-[#ebe8e898] px-4 py-2 w-full text-[18px]"
                  >
                    Account
                  </button>
                  <ProfileCard
                    formattedIcpBalance={formattedIcpBalance}
                    profileModalIsOpen={profileModalIsOpen}
                    setProfileModalIsOpen={setProfileModalIsOpen}
                  />
                </div>

                <Link
                  to="/profile"
                  onClick={() => handleSectionClick("profile")}
                  className="block hover:text-[#ebe8e898] px-4 py-2 text-[18px] border-b"
                >
                  Profile
                </Link>

                <div className="hidden md:block">
                  <button
                    onClick={openUserModal}
                    className="block hover:text-[#ebe8e898] px-4 w-full py-2 text-[18px]"
                  >
                    Update User
                  </button>
                  <UpdateUser
                    userModalIsOpen={userUpdateIsOpen}
                    setUserModalIsOpen={setUserUpdateIsOpen}
                  />
                </div>
              </div>
            </div>

          </div>
        )}
      </nav>

      {/* Dropdown Menu for screens below 768px */}
      {menuOpen && (
        <div className="md:hidden flex flex-col font-posterama text-[17px] xxs1:text-[20px] justify-center items-center absolute z-20 bg-black w-full py-8 px-6 shadow-lg">
          <Link
            to="/"
            onClick={() => handleSectionClick("home")}
            className={`block py-4`}
          >
            Home
          </Link>
          <Link
            to="/projects"
            onClick={() => handleSectionClick("project")}
            className={`block py-4 `}
          >
            Projects
          </Link>
          <Link
            to="/LaunchCoin"
            onClick={() => handleSectionClick("coin")}
            className={`block py-4 `}
          >
            Launch a Coin
          </Link>

          {!isAuthenticated ? (
            ""
          ) : (
            <>
              <Link
                to="/profile"
                onClick={() => handleSectionClick("coin")}
                className={`block py-4 `}
              >
                Profile
              </Link>
            </>
          )}

          {!isAuthenticated ? (
            ""
          ) : (
            <>
              <button
                onClick={openUserModal}
                className="block py-4 "
              >
                Update User
              </button>
              <UpdateUser
                userModalIsOpen={userUpdateIsOpen}
                setUserModalIsOpen={setUserUpdateIsOpen}
              />
            </>
          )}



          {!isAuthenticated ? (
            <button
              onClick={openModal}
              className=" mt-[80px]   bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]
         text-black  relative w-[220px] h-[35px] p-[1.5px]
            text-[16px] md:text-[18px] font-[600] rounded-3xl flex items-center justify-center "
            >
              Connect Wallet
            </button>
          ) : (
            <>
              {" "}
              <button
                onClick={openProfileModal}
                className=" mt-[80px] flex   bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]
          relative w-[220px] h-[35px] p-[1.5px]
            text-[16px] md:text-[18px] font-[600] rounded-3xl  "
              >
                <div className="bg-black w-full h-full  rounded-3xl flex items-center justify-center ">
                  Account
                </div>
              </button>
              <ProfileCard
                formattedIcpBalance={formattedIcpBalance}
                profileModalIsOpen={profileModalIsOpen}
                setProfileModalIsOpen={setProfileModalIsOpen}
              />
            </>
          )}
        </div>
      )}

      <div
        className="flex items-center bg-[#222222] py-1 px-[4%] md:text-[8px] md1:text-[10px] lg:text-[12px] lg:gap-4 lg1:gap-6 dlg:text-[14px] 
  dxl:text-[15px] xl:text-[16px] md:gap-6 dxl:gap-8 gap-7 whitespace-nowrap overflow-x-auto no-scrollbar"
      >
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