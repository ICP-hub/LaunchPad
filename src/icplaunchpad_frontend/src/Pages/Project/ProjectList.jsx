import React from "react";
import tokenHolder from "../../assets/images/tokenHolder.png";

const ProjectList = () => {
  const progress = 35.1;
  const raised = 30;

  return (
    <>
      <div className="flex lg:flex-row flex-col flex-wrap w-[95%] m-auto justify-around">
        <div className="bg-[#FFFFFF1A] text-white p-1 rounded-lg flex flex-col w-full lg:w-[400px] mt-14">
          <div className="h-[280px] rounded-lg py-5 flex flex-col">
            <div className="relative">
              <img
                src={tokenHolder}
                className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[50%] rounded-full h-[100px] md:min-h-[114px]"
                alt=""
              />
            </div>

            <div className="mt-[70px] text-center text-white space-y-5">
              <div className="text-[24px] font-bold">PuPPo</div>
              <div className="text-[16px] font-medium">
                FAir Launnch - Max buy 5 SOL
              </div>
              <div className="text-[#FFC145] text-[18px] font-semibold">
                Upcoming
              </div>
            </div>

            <div className="bg-[#FFFFFF66] h-[2px] w-[92%] mx-auto mt-6"></div>
          </div>
          <div className="flex">
            <div className="relative flex items-center overflow-hidden w-[60%] h-72">
              <div className="absolute lg:left-[-35%] left-[-30%] sm:left-[-20%] md:left-[-15%]  top-0 w-72 h-72">
                <svg className="transform rotate-90" viewBox="0 0 36 36">
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#f3b3a7", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#cac9f5", stopOpacity: 1 }}
                      />
                    </linearGradient>
                  </defs>
                  <path
                    className="text-gray-800"
                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.8"
                  />
                  <path
                    className="text-purple-400"
                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3.8"
                    strokeDasharray={`${progress}, 100`}
                  />
                </svg>
                <div className="absolute ml-10 inset-0 flex flex-col items-center justify-center">
                  <span>Progress</span>
                  <span className="text-lg font-semibold text-white">
                    {" "}
                    ({progress}%)
                  </span>
                  <span className="text-sm text-gray-400 mt-1">
                    {raised} SOL RAISED
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 w-[40%] flex flex-col justify-around ">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Soft</span>
                <span className="text-lg font-semibold">100 SOL</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Liquidity</span>
                <span className="text-lg font-semibold">51%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Lock Time</span>
                <span className="text-lg font-semibold">365 days</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">SAle Starts In</span>
                <span className="text-lg font-semibold">00:29:23:00</span>
              </div>
              <div className="border-b-2 border-r-gray-600 w-20 cursor-pointer">
                Vew More
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF1A] text-white p-1 rounded-lg flex flex-col w-full lg:w-[400px] mt-14">
          <div className="h-[280px] rounded-lg py-5 flex flex-col">
            <div className="relative">
              <img
                src={tokenHolder}
                className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[50%] rounded-full h-[100px] md:min-h-[114px]"
                alt=""
              />
            </div>

            <div className="mt-[70px] text-center text-white space-y-5">
              <div className="text-[24px] font-bold">PuPPo</div>
              <div className="text-[16px] font-medium">
                FAir Launnch - Max buy 5 SOL
              </div>
              <div className="text-[#FFC145] text-[18px] font-semibold">
                Upcoming
              </div>
            </div>

            <div className="bg-[#FFFFFF66] h-[2px] w-[92%] mx-auto mt-6"></div>
          </div>
          <div className="flex">
            <div className="relative flex items-center overflow-hidden w-[60%] h-72">
              <div className="absolute lg:left-[-35%] left-[-30%] sm:left-[-20%] md:left-[-15%]  top-0 w-72 h-72">
                <svg className="transform rotate-90" viewBox="0 0 36 36">
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#f3b3a7", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#cac9f5", stopOpacity: 1 }}
                      />
                    </linearGradient>
                  </defs>
                  <path
                    className="text-gray-800"
                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.8"
                  />
                  <path
                    className="text-purple-400"
                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3.8"
                    strokeDasharray={`${progress}, 100`}
                  />
                </svg>
                <div className="absolute ml-10 inset-0 flex flex-col items-center justify-center">
                  <span>Progress</span>
                  <span className="text-lg font-semibold text-white">
                    {" "}
                    ({progress}%)
                  </span>
                  <span className="text-sm text-gray-400 mt-1">
                    {raised} SOL RAISED
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 w-[40%] flex flex-col justify-around ">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Soft</span>
                <span className="text-lg font-semibold">100 SOL</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Liquidity</span>
                <span className="text-lg font-semibold">51%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Lock Time</span>
                <span className="text-lg font-semibold">365 days</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">SAle Starts In</span>
                <span className="text-lg font-semibold">00:29:23:00</span>
              </div>
              <div className="border-b-2 border-r-gray-600 w-20 cursor-pointer">
                Vew More
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF1A] text-white p-1 rounded-lg flex flex-col w-full lg:w-[400px] mt-14">
          <div className="h-[280px] rounded-lg py-5 flex flex-col">
            <div className="relative">
              <img
                src={tokenHolder}
                className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[50%] rounded-full h-[100px] md:min-h-[114px]"
                alt=""
              />
            </div>

            <div className="mt-[70px] text-center text-white space-y-5">
              <div className="text-[24px] font-bold">PuPPo</div>
              <div className="text-[16px] font-medium">
                FAir Launnch - Max buy 5 SOL
              </div>
              <div className="text-[#FFC145] text-[18px] font-semibold">
                Upcoming
              </div>
            </div>

            <div className="bg-[#FFFFFF66] h-[2px] w-[92%] mx-auto mt-6"></div>
          </div>
          <div className="flex">
            <div className="relative flex items-center overflow-hidden w-[60%] h-72">
              <div className="absolute lg:left-[-35%] left-[-30%] sm:left-[-20%] md:left-[-15%]  top-0 w-72 h-72">
                <svg className="transform rotate-90" viewBox="0 0 36 36">
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#f3b3a7", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#cac9f5", stopOpacity: 1 }}
                      />
                    </linearGradient>
                  </defs>
                  <path
                    className="text-gray-800"
                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.8"
                  />
                  <path
                    className="text-purple-400"
                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3.8"
                    strokeDasharray={`${progress}, 100`}
                  />
                </svg>
                <div className="absolute ml-10 inset-0 flex flex-col items-center justify-center">
                  <span>Progress</span>
                  <span className="text-lg font-semibold text-white">
                    {" "}
                    ({progress}%)
                  </span>
                  <span className="text-sm text-gray-400 mt-1">
                    {raised} SOL RAISED
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 w-[40%] flex flex-col justify-around ">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Soft</span>
                <span className="text-lg font-semibold">100 SOL</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Liquidity</span>
                <span className="text-lg font-semibold">51%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Lock Time</span>
                <span className="text-lg font-semibold">365 days</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">SAle Starts In</span>
                <span className="text-lg font-semibold">00:29:23:00</span>
              </div>
              <div className="border-b-2 border-r-gray-600 w-20 cursor-pointer">
                Vew More
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectList;
