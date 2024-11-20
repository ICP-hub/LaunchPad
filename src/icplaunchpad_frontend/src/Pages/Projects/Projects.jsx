import React, { useEffect, useState, useCallback } from "react";
import { TbFilterCheck } from "react-icons/tb";
import { PiArrowsDownUpBold } from "react-icons/pi";
import { FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ProjectCard from "./ProjectCard.jsx";
import { TokensInfoHandlerRequest } from "../../StateManagement/Redux/Reducers/TokensInfo.jsx";
import { useAuth } from "../../StateManagement/useContext/useClient.jsx";
import { debounce } from "lodash";
import { upcomingSalesHandlerRequest } from "../../StateManagement/Redux/Reducers/UpcomingSales.jsx";
import { SuccessfulSalesHandlerRequest } from "../../StateManagement/Redux/Reducers/SuccessfulSales.jsx";

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

  const dispatch = useDispatch();
  const projectsData = useSelector((state) => state?.TokensInfo?.data || []);
  const upcomingSales = useSelector((state) => state?.upcomingSales?.data || []);
  const successfulSales = useSelector((state) => state?.SuccessfulSales?.data || []);
  const { createCustomActor } = useAuth();

  // Fetch tokens data on mount
  useEffect(() => {
    dispatch(TokensInfoHandlerRequest());
  }, [dispatch]);

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
    setTokensData(salesData || projectsData);
  }, [salesData, projectsData]);

  // Debounced filter function
  const debouncedFilterData = useCallback(
    debounce(async (searchValue, tokens) => {
      if (!searchValue) {
        setFilteredTokensData(tokens);
        return;
      }

      const filteredData = await Promise.all(
        tokens.map(async (data) => {
          try {
            const tokenName =
              data.token_name || (await getTokenName(data[0]?.ledger_canister_id));
            return tokenName.toLowerCase().includes(searchValue.toLowerCase())
              ? data
              : null;
          } catch (error) {
            console.error("Error filtering tokens:", error);
            return null;
          }
        })
      );

      setFilteredTokensData(filteredData.filter(Boolean));
    }, 500),
    [getTokenName]
  );

  // Handle search filtering
  useEffect(() => {
    debouncedFilterData(search, tokensData);

    return () => {
      debouncedFilterData.cancel();
    };
  }, [search, tokensData, debouncedFilterData]);

  // Update tokens based on sale type
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

  // Handle sorting
  const handleSort = useCallback(
    async (order) => {
      const sortedData = await Promise.all(
        tokensData.map(async (data) => {
          const tokenName =
            data.token_name || (await getTokenName(data[0]?.ledger_canister_id));
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
              className={`cursor-pointer relative ${selectedTab === tab
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
              <div className="absolute text-[15px] top-[110%] left-0 w-[100px] bg-[#333333] font-posterama text-white rounded-lg p-1 z-10 shadow-lg">
                {["Upcoming", "Active", "Successful"].map((type) => (
                  <p
                    key={type}
                    className="cursor-pointer border-b-2 py-2"
                    onClick={() => {
                      type == 'Upcoming' ? dispatch(upcomingSalesHandlerRequest()) 
                      : type == 'Successful' ?  dispatch(SuccessfulSalesHandlerRequest())
                      :  dispatch(TokensInfoHandlerRequest());
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
               <div className="absolute text-[15px] top-[110%] right-2 w-[105px] bg-[#333333] font-posterama text-white rounded-lg p-2 z-10 shadow-lg">
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
        {filteredTokensData.length > 0 ?
          filteredTokensData.map((sale, index) => (
            sale && <ProjectCard initial_Total_supply={ sale[1] || null} projectData={sale[0] || sale} saleType={saleType} key={index} />
          ))
          :
      <h1 className="text-xl mx-auto my-16"> Data Not Found... </h1>

        }
      </div>
    </div>
  );
};

export default ProjectLists;