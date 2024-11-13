import React, { useEffect, useState } from "react";
import { TbFilterCheck } from "react-icons/tb";
import { PiArrowsDownUpBold } from "react-icons/pi";
import { FaChevronDown } from "react-icons/fa"; // Import down arrow icon
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ProjectCard from "./ProjectCard.jsx";
import { TokensInfoHandlerRequest } from "../../StateManagement/Redux/Reducers/TokensInfo.jsx";
import { useAuth } from "../../StateManagement/useContext/useClient.jsx";

const ProjectLists = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [search, setSearch] = useState("");
  const [TokensData, setTokensData] = useState(null);
  const [filteredTokensData, setFilteredTokensData] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const location = useLocation();
  const dispatch= useDispatch();
  
  const salesData = location.state?.salesData;
  
  
  const { actor } = useAuth();
  const [projectsData, setprojectsData] = useState([]);

  console.log("Fetched tokens in ProjectLists:", projectsData);

  useEffect(() => {
    const fetchUserTokensInfo = async () => {
      try {
        if (actor) {
          const response = await actor.get_tokens_info();
          if (response && response.length > 0) {
            setprojectsData(response);
          } else {
            console.log("No tokens data available or empty response.");
          }
        } else {
          console.log("User account has not been created yet.");
        }
      } catch (error) {
        console.error("Error fetching user tokens info:", error.message);
      }
    };

    fetchUserTokensInfo();
  }, [actor]);

  useEffect(() => {
    const allTokens = salesData || projectsData;
    console.log("all tokens", allTokens);
    setTokensData(allTokens);
    setFilteredTokensData(allTokens);
  }, [salesData, projectsData]);

  useEffect(() => {
    if (TokensData) {
      const filteredData = search
        ? TokensData.filter((data) =>
            data.token_name.toLowerCase().includes(search.toLowerCase())
          )
        : TokensData;
      setFilteredTokensData(filteredData);
    }
  }, [search, TokensData]);

  return (
    <div className="upcoming-sales h-full md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]">
      <div className="bg-black text-white px-4 xxs1:px-16">
        <h1 className="text-[40px] font-posterama font-bold">PROJECTS</h1>

        <div className="flex space-x-8 ss2:space-x-12 my-8">
          <button
            className={`cursor-pointer relative ${
              selectedTab === "all"
                ? "before:absolute before:left-0 before:right-0 before:top-7 before:h-[2px] before:bg-gradient-to-r before:from-[#F3B3A7] before:to-[#CACCF5] before:rounded text-transparent bg-clip-text bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]"
                : ""
            }`}
            onClick={() => setSelectedTab("all")}
          >
            ALL
          </button>
          <button
            className={`cursor-pointer relative ${
              selectedTab === "advanced"
                ? "before:absolute before:left-0 before:right-0 before:top-7 before:h-[2px] before:bg-gradient-to-r before:from-[#F3B3A7] before:to-[#CACCF5] before:rounded text-transparent bg-clip-text bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]"
                : ""
            }`}
            onClick={() => setSelectedTab("advanced")}
          >
            ADVANCED
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#444444] text-white p-2 rounded-xl outline-none placeholder-gray-500"
          />

          <div className="flex pr-2 gap-5 md:gap-2 md:mt-0 mt-4 w-full md:w-[30%] items-center justify-center relative">
            {/* Filter Button with Dropdown */}
            <button
              onClick={() => setShowFilterDropdown((prev) => !prev)}
              className="bg-[#444444] ml-[-2%] p-2 rounded-lg text-white flex items-center w-full"
            >
              <TbFilterCheck />
              <span className="md:ml-2">Filter</span>
              <FaChevronDown className="ml-2" />
            </button>
            {showFilterDropdown && (
              <div className="absolute top-[110%] left-0 w-[160px]  bg-[#333333] font-posterama text-white rounded-lg p-2 z-10 shadow-lg">
                {/* Filter options go here */}
                <p className="cursor-pointer border-b-2 py-2">Upcoming Sales</p>
                <p className="cursor-pointer border-b-2 py-2">Successful Sales</p>
              </div>
            )}

            {/* Sort Button with Dropdown */}
            <button
              onClick={() => setShowSortDropdown((prev) => !prev)}
              className="bg-[#444444] p-2 rounded-lg text-white flex items-center w-full"
            >
              <PiArrowsDownUpBold />
              <span className="ml-2">Sort</span>
              <FaChevronDown className="ml-2" />
            </button>
            {showSortDropdown && (
              <div className="absolute top-[110%] right-0  w-[150px] bg-[#333333] font-posterama text-white rounded-lg p-2 z-10 shadow-lg">
                {/* Sort options go here */}
                <p className="cursor-pointer border-b-2 py-2">Low To High</p>
                <p className="cursor-pointer  border-b-2 py-2">High To Low</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col flex-wrap items-center w-[95%] m-auto gap-24 justify-start">
        {filteredTokensData && filteredTokensData.map((sale, index) => (
          sale && <ProjectCard projectData={sale} saleType="saleType" key={index} />
        ))}
      </div>
    </div>
  );
};

export default ProjectLists;
