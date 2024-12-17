import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProjectCardSkeleton = ({count, cardType}) => {
  return (
    Array(count).fill(0).map((_, i)=>(
      <div key={i} className="bg-[#FFFFFF1A] cursor-pointer text-white p-1 pb-4 rounded-xl flex flex-col w-[340px] md:w-[375px] mt-14 mx-0 sm:mx-2">
        {/* Profile Image Placeholder */}
        <div className="h-[250px] rounded-lg py-5 flex flex-col">
          <div className="relative">
            {/* Large Profile Circle */}
            <div className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-[50%]">
              <Skeleton circle height={100} width={100} />
            </div>

            {/* Small ICP Image Placeholder */}
            <div className="absolute top-[20px] right-[60px] ss2:right-[100px] xxs1:right-[130px] w-10 h-10 rounded-full">
              <Skeleton circle height={40} width={40} />
            </div>
          </div>

          {/* Token Name and Launch Text */}
          <div className="mt-[70px] text-center space-y-3">
            <div className="text-[24px] font-semibold">
              <Skeleton width={120} height={24} />
            </div>
            <div className="text-[16px]">
              <Skeleton width={90} height={18} />
            </div>
           { (cardType==='AllTokens') ? '' 
           :
            <div className="text-[#FFC145] text-[18px]">
              <Skeleton width={100} height={20} />
            </div>
            }
          </div>

          {/* Divider */}
          <div className="bg-[#FFFFFF66] h-[2px] w-[92%] mx-auto mt-5"></div>
        </div>

        {/* Progress and Side Details */}
        {(cardType==='AllTokens') ? 
        <div className="mb-3 flex flex-wrap gap-4 justify-center">
          <div className="flex flex-col items-center bg-gradient-to-r from-[#1d1e22] via-[#25282d] to-[#1d1e22] rounded-lg p-4 shadow-lg w-[45%]">
            <span className="text-xs text-gray-300 tracking-wide"> <Skeleton width={60} height={15} /> </span>
            <span className="text-lg font-bold text-gradient bg-gradient-to-r from-[#f09787] to-[#CACCF5] text-transparent bg-clip-text">
            <Skeleton width={60} height={15} />
            </span>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-r from-[#1d1e22] via-[#25282d] to-[#1d1e22] rounded-lg p-4 shadow-lg w-[45%]">
            <span className="text-xs text-gray-300 tracking-wide"> <Skeleton width={60} height={15} /> </span>
            <span className="text-lg font-bold text-white">
            <Skeleton width={60} height={15} />
            </span>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-r from-[#1d1e22] via-[#25282d] to-[#1d1e22] rounded-lg p-4 shadow-lg w-[90%]">
            <span className="text-xs text-gray-300 tracking-wide"><Skeleton width={60} height={15} /></span>
            <span className="text-lg font-bold text-white">
            <Skeleton width={60} height={15} />
            </span>
          </div>
        </div>
        :
        <div className="flex">
          {/* Progress Bar Skeleton */}
          <div className="w-[60%] mt-6 flex flex-col justify-center px-4">
            <span className="text-sm text-gray-400 ml-10">
                <Skeleton width={60} height={15} />
              </span>
              <span className="text-lg font-semibold ml-10">
                <Skeleton width={80} height={20} />
              </span>
              <span className="text-sm text-gray-400 ml-10">
                <Skeleton width={60} height={15} />
              </span>
          </div>

          {/* Right Section */}
          <div className="mt-8 w-[40%] flex flex-col justify-around">
            <div className="flex flex-col mb-5">
              <span className="text-sm text-gray-400">
                <Skeleton width={60} height={15} />
              </span>
              <span className="text-lg font-semibold">
                <Skeleton width={90} height={20} />
              </span>
            </div>
            <div className="flex flex-col mb-5">
              <span className="text-sm text-gray-400">
                <Skeleton width={60} height={15} />
              </span>
              <span className="text-lg font-semibold">
                <Skeleton width={90} height={20} />
              </span>
            </div>
            <div className="flex flex-col mt-2 mb-8">
              <Skeleton width={110} height={20} />
            </div>

            <button className="border-b-2 border-r-gray-600 w-20 mb-4">
              <Skeleton width={80} height={20} />
            </button>
          </div>
        </div>
        }
      </div>

    ))
   
  );
};

export default ProjectCardSkeleton;
