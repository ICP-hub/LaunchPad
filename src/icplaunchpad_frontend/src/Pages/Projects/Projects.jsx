import React, { useEffect, useState, useCallback } from "react";
import { TbFilterCheck } from "react-icons/tb";
import { PiArrowsDownUpBold } from "react-icons/pi";
import { FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ProjectCard from "./ProjectCard.jsx";
import { TokensInfoHandlerRequest } from "../../StateManagement/Redux/Reducers/TokensInfo.jsx";

import { useAuth } from "../../StateManagement/useContext/useClient.jsx";

const ProjectLists = () => {
  const location = useLocation();
  const { salesData, sale_Type } = location.state || {};
  const [selectedTab, setSelectedTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [tokensData, setTokensData] = useState([]);
  const [filteredTokensData, setFilteredTokensData] = useState([]);
  const [saleType, setSaleType] = useState(sale_Type || "Active");
  const { actor, createCustomActor } = useAuth();
  const [projectsData, setprojectsData] = useState([]);

  console.log("Fetched tokens in ProjectLists:", projectsData);
  const [upcomingSales, setUpcommintSales] = useState([])
  console.log("my upcomming sales in upcomming sale", salesData)
  const[successfulSales, setSuccessfullSalesData] = useState([]);

  console.log("Fetched tokens in ProjectLists:", salesData);
  const getTokenName = useCallback(
    async (ledger_canister_id) => {
      try {
        const ledgerActor = await createCustomActor(ledger_canister_id);
        const tokenName = await ledgerActor.icrc1_name();
        return tokenName;
      } catch (error) {
        console.error("Error fetching token name:", error);
        return ""; // Fallback in case of error
      }
    },
    [createCustomActor]
  );
  

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
    UpcommingSales()
  }, [])

  async function UpcommingSales() {
    try {
      // Check if actor is defined
      if (actor) {
        const response = await actor.get_upcoming_sales();
        setUpcommintSales(response)
      }
      else {
        console.log("User account has not been created yet.");
      }
    } catch (error) {
      console.error("Specific error occurred:", error.message);
    }
  }
  useEffect(() => {
    setTokensData(salesData || projectsData);
  }, [salesData, projectsData]);


  useEffect(() => {
    // Fetch token information when the component mounts
    const fetchUserTokensInfo = async () => {
      try {
        if (actor) {
          const response = await actor.get_successful_sales();
          if (response && response.length > 0) {
            setSuccessfullSalesData(response);
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
    const filterData = async () => {
      if (!search) {
        setFilteredTokensData(tokensData);
        return;
      }
      const filteredData = await Promise.all(
        tokensData.map(async (data) => {
          try {
            const tokenName = data.token_name || (await getTokenName(data.ledger_canister_id));
            return tokenName.toLowerCase().includes(search.toLowerCase()) ? data : null;
          } catch (error) {
            console.error("Error filtering tokens:", error);
            return null;
          }
        })
      );
      setFilteredTokensData(filteredData.filter(Boolean));
    };
    filterData();
  }, [search, tokensData, getTokenName]);

  useEffect(() => {
    switch (saleType) {
      case "Upcoming":
        setTokensData(upcomingSales);
        break;
      case "Active":
        setTokensData(projectsData);
        break;
      case "Successful":
        setTokensData(successfulSales);
        break;
      default:
        setTokensData(projectsData);
    }
  }, [saleType, projectsData, upcomingSales, successfulSales]);

  const handleSort = useCallback(
    async (order) => {
      const sortedData = await Promise.all(
        tokensData.map(async (data) => {
          const tokenName = data.token_name || (await getTokenName(data.ledger_canister_id));
          return { ...data, resolvedTokenName: tokenName.toLowerCase() };
        })
      );

      sortedData.sort((a, b) => {
        return order === "A to Z"
          ? a.resolvedTokenName.localeCompare(b.resolvedTokenName)
          : b.resolvedTokenName.localeCompare(a.resolvedTokenName);
      });

      setFilteredTokensData(sortedData);
    },
    [tokensData, getTokenName]
  );

  return (
    <div className="upcoming-sales h-full md:mb-[5%] lg:mb-0 sm4:mb-3 py-[5%]">
      <div className="bg-black text-white px-4 xxs1:px-16">
        <h1 className="text-[40px] font-posterama font-bold">PROJECTS</h1>

        {/* Tab Selection */}
        <div className="flex space-x-8 ss2:space-x-12 my-8">
          {["all", "advanced"].map((tab) => (
            <button
              key={tab}
              className={`cursor-pointer relative ${
                selectedTab === tab
                  ? "before:absolute before:left-0 before:right-0 before:top-7 before:h-[2px] before:bg-gradient-to-r before:from-[#F3B3A7] before:to-[#CACCF5] before:rounded text-transparent bg-clip-text bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5]"
                  : ""
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search and Filter/Sort Controls */}
        <div className="flex flex-col md:flex-row items-center justify-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#444444] text-white p-2 rounded-xl outline-none placeholder-gray-500"
          />

          <div className="flex pr-2 gap-5 md:gap-2 md:mt-0 mt-4 w-full md:w-[30%] items-center justify-center relative">
            {/* Filter Dropdown */}
            <button
              onClick={() => setShowFilterDropdown((prev) => !prev)}
              className="bg-[#444444] ml-[-2%] p-2 rounded-lg text-white flex items-center w-full"
            >
              <TbFilterCheck />
              <span className="md:ml-2">Filter</span>
              <FaChevronDown className="ml-2" />
            </button>
            {showFilterDropdown && (
              <div className="absolute top-[110%] left-0 w-[160px] bg-[#333333] font-posterama text-white rounded-lg p-2 z-10 shadow-lg">
                {["Upcoming", "Active", "Successful"].map((type) => (
                  <p
                    key={type}
                    className="cursor-pointer border-b-2 py-2"
                    onClick={() => {
                      setSaleType(type);
                      setShowFilterDropdown(false);
                    }}
                  >
                    {type}
                  </p>
                ))}
              </div>
            )}

            {/* Sort Dropdown */}
            <button
              onClick={() => setShowSortDropdown((prev) => !prev)}
              className="bg-[#444444] p-2 rounded-lg text-white flex items-center w-full"
            >
              <PiArrowsDownUpBold />
              <span className="ml-2">Sort</span>
              <FaChevronDown className="ml-2" />
            </button>
            {showSortDropdown && (
              <div className="absolute top-[110%] right-0 w-[135px] bg-[#333333] font-posterama text-white rounded-lg p-2 z-10 shadow-lg">
                <p
                  className="cursor-pointer border-b-2 py-2"
                  onClick={() => handleSort("A to Z")}
                >
                  A to Z
                </p>
                <p
                  className="cursor-pointer border-b-2 py-2"
                  onClick={() => handleSort("Z to A")}
                >
                  Z to A
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Cards Display */}
      <div className="flex lg:flex-row flex-col flex-wrap items-center w-[95%] m-auto gap-24 justify-start">
        {filteredTokensData &&
          filteredTokensData.map((sale, index) => (
            sale && <ProjectCard projectData={sale} saleType={saleType} key={index} />
          ))}
      </div>
    </div>
  );
};

export default ProjectLists;
