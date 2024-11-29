// import React, { useState } from 'react';

// const LaunchpadInfoTab = ({presaleDetails, setPresaleDetails }) => {
//   const [whiteList, setWhitelist] = useState(false);

//   // Handle Whitelist toggle
//   const handleWhitelist = (value) => {
//     setWhitelist(value);
//     setPresaleDetails((prev) => ({ ...prev, whiteList: value }));
//   };

//   return (
//     <div className="bg-[#222222] p-4 xxs1:p-8 m-4 rounded-2xl mb-[115px] xxs1:mb-[60px] sm2:mb-[30px]">
      
//       {/* Chain Text with Gray Background on mobile only */}
//       <div className="flex xxs1:hidden mb-8 bg-[#444444] pl-6 p-2 mt-[-31px] mx-[-17px] xxs1:mx-[-31px] rounded-2xl">
//         <span className="text-white text-[22px]">Chain</span>
//       </div>

//       {/* Presale Rate */}
//       <div className="mb-4">
//         <label className="block text-[19px] mb-2">Presale Rate</label>
//         <input
//           type="number"
//           value={presaleDetails.presaleRate}
//           onChange={(e) => setPresaleDetails(prev => ({ ...prev, presaleRate: e.target.value }))}
//           className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
//           aria-label="Presale Rate"
//         />
//       </div>

//       {/* Hardcap Token */}
//       <div className="mb-4">
//         <label className="block text-[19px] mb-2">Hardcap Token</label>
//         <input
//           type="number"
//           value={presaleDetails.hardcapToken}
//           onChange={(e) => setPresaleDetails(prev => ({ ...prev, hardcapToken: e.target.value }))}
//           className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
//           aria-label="Hardcap Token"
//         />
//       </div>

//       {/* Softcap Token */}
//    {/* Whitelist Option */}
//       <div className="mb-4">
//         <label className="block text-[19px] mb-1">Whitelist</label>
//         <div className="flex items-center gap-4 mb-4">
//           <label className="flex items-center">
//             <input
//               type="radio"
//               name="whitelist"
//               value={false}
//               checked={!whiteList}
//               onChange={() => handleWhitelist(false)}
//               className="hidden peer"
//               aria-label="Disable Whitelist"
//             />
//             <div className="w-4 h-4 border-2 border-white rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] flex items-center justify-center mr-2">
//               <div className="w-1.5 h-1.5 rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5]"></div>
//             </div>
//             Disable
//           </label>

//           <label className="flex items-center">
//             <input
//               type="radio"
//               name="whitelist"
//               value={true}
//               checked={whiteList}
//               onChange={() => handleWhitelist(true)}
//               className="hidden peer"
//               aria-label="Enable Whitelist"
//             />
//             <div className="w-4 h-4 border-2 border-white rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] flex items-center justify-center mr-2">
//               <div className="w-1.5 h-1.5 rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5]"></div>
//             </div>
//             Enable
//           </label>
//         </div>
//         <p className="text-xs">Toggle whitelist on/off anytime.</p>
//       </div>      <div className="mb-8">
//         <label className="block text-[19px] mb-2">Softcap Token</label>
//         <input
//           type="number"
//           value={presaleDetails.softcapToken}
//           onChange={(e) => setPresaleDetails(prev => ({ ...prev, softcapToken: e.target.value }))}
//           className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
//           aria-label="Softcap Token"
//         />
//       </div>

//    

//       {/* Minimum Buy and Maximum Buy */}
//       <div className="flex flex-col xxs1:flex-row justify-between mb-4">
//         <div className="xxs1:w-1/2 pr-2 mb-6">
//           <label className="block text-[19px] mb-1">Minimum Buy</label>
//           <input
//             type="number"
//             value={presaleDetails.minimumBuy}
//             onChange={(e) => setPresaleDetails(prev => ({ ...prev, minimumBuy: e.target.value }))}
//             className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
//             aria-label="Minimum Buy"
//           />
//         </div>
//         <div className="xxs1:w-1/2 xxs1:pl-2 mb-6">
//           <label className="block text-[19px] mb-1">Maximum Buy</label>
//           <input
//             type="number"
//             value={presaleDetails.maximumBuy}
//             onChange={(e) => setPresaleDetails(prev => ({ ...prev, maximumBuy: e.target.value }))}
//             className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
//             aria-label="Maximum Buy"
//           />
//         </div>
//       </div>

//       {/* Start Time and End Time */}
//       <div className="flex flex-col xxs1:flex-row justify-between mb-[50px] xxs1:mb-8">
//         <div className="xxs1:w-1/2 pr-2 mb-6">
//           <label className="block text-[19px] mb-1">Start Time</label>
//           <input
//             type="datetime-local"
//             value={presaleDetails.startTime}
//             onChange={(e) => setPresaleDetails(prev => ({ ...prev, startTime: e.target.value }))}
//             className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
//             aria-label="Start Time"
//           />
//         </div>
//         <div className="xxs1:w-1/2 xxs1:pl-2 mb-6">
//           <label className="block text-[19px] mb-1">End Time</label>
//           <input
//             type="datetime-local"
//             value={presaleDetails.endTime}
//             onChange={(e) => setPresaleDetails(prev => ({ ...prev, endTime: e.target.value }))}
//             className="w-full p-2 bg-[#333333] text-white rounded-md border-b-2"
//             aria-label="End Time"
//           />
//         </div>
//       </div>
      
//     </div>
//   );
// };

// export default LaunchpadInfoTab;

import React, { useState } from "react";

const LaunchpadInfoTab = ({
  register,
  errors,
  presaleDetails,
  setPresaleDetails,
}) => {
  console.log('presaleDetails.token_name',presaleDetails)
  // Watch the whitelist value from the form data
  // const whiteList = watch("whiteList");
  const [whiteList, setWhitelist] = useState(false);

  // Handle Whitelist toggle
  const handleWhitelist = (value) => {
    setWhitelist(value);
    setPresaleDetails((prev) => ({ ...prev, whiteList: value }));
  };

  return (
    <div className="bg-[#222222] p-4 xxs1:p-8 m-4 rounded-2xl mb-[80px] dxs:mb-[140px] xxs1:mb-[90px] sm2:mb-[70px]  md:mb-[15px]   ">
      {/* Chain Text with Gray Background on mobile only */}
      <div className="flex  mb-8 bg-[#444444] pl-6 p-2 mt-[-31px] mx-[-17px] xxs1:mx-[-31px]  rounded-2xl">
        <span className="text-white text-[22px]"> Launchpad Info </span>
      </div>

      {/* Presale Rate */}
      <div className="mb-4">
        <label className="block text-[19px] mb-2">Fairlaunch Token</label>
        <input
          type="number"
          placeholder={' Total tokens for the Fairlaunch'}
          {...register("FairlaunchTokens")} // Register input field
          className={`w-full p-2 bg-[#333333] text-white rounded-md ${errors.presaleRate ? "border-red-500" : "border-white no-spinner"
            }  border-b-2`}
          aria-label="Fairlaunch Tokens"
          onKeyDown={(e) => {
            if (e.key === '-' || e.key === 'e' || e.key === '+') {
              e.preventDefault();
            }
          }}
           min="0"
        />
        {errors.FairlaunchTokens && (
          <p className="text-red-500 text-[14px]">{errors.FairlaunchTokens.message}</p>
        )}
      </div>

      {/* Hardcap Token */}
      <div className="mb-4">
        <label className="block text-[19px] mb-2">Hardcap Token</label>
        <input
          type="number"
          {...register("hardcapToken")} // Register input field
          placeholder=" Maximum funds to be raised "
          className={`w-full p-2 bg-[#333333] text-white rounded-md ${errors.hardcapToken ? "border-red-500" : "border-white no-spinner"
            }  border-b-2`}
          aria-label="Hardcap Token"
          onKeyDown={(e) => {
            if (e.key === '-' || e.key === 'e' || e.key === '+') {
              e.preventDefault();
            }
          }}
           min="0"
        />
        {errors.hardcapToken && (
          <p className="text-red-500 text-[14px]">{errors.hardcapToken.message}</p>
        )}
      </div>

      {/* Softcap Token */}
      <div className="mb-8">
        <label className="block text-[19px] mb-2">Softcap Token</label>
        <input
          type="number"
          {...register("softcapToken")} // Register input field
           placeholder=" Minimum funds to be raised "
          className={`w-full p-2 bg-[#333333] text-white rounded-md ${errors.softcapToken ? "border-red-500" : "border-white no-spinner"
            }  border-b-2`}
          aria-label="Softcap Token"
          onKeyDown={(e) => {
            if (e.key === '-' || e.key === 'e' || e.key === '+') {
              e.preventDefault();
            }
          }}
           min="0"
        />
        {errors.softcapToken && (
          <p className="text-red-500 text-[14px]">{errors.softcapToken.message}</p>
        )}
      </div>

      {/* Whitelist Option */}
         {/* Whitelist Option */}
      {/* <div className="mb-4">
         <label className="block text-[19px] mb-1">Whitelist</label>
        <div className="flex items-center gap-4 mb-4">
           <label className="flex items-center">
            <input
               type="radio"
               name="whitelist"
               value={false}
               checked={!whiteList}
               onChange={() => handleWhitelist(false)}
               className="hidden peer"
               aria-label="Disable Whitelist"
             />
             <div className="w-4 h-4 border-2 border-white rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] flex items-center justify-center mr-2">
               <div className="w-1.5 h-1.5 rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5]"></div>
             </div>
             Disable
           </label>
           <label className="flex items-center">
             <input
               type="radio"
               name="whitelist"
               value={true}
               checked={whiteList}
               onChange={() => handleWhitelist(true)}
               className="hidden peer"
               aria-label="Enable Whitelist"
             />
            <div className="w-4 h-4 border-2 border-white rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] flex items-center justify-center mr-2">
              <div className="w-1.5 h-1.5 rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5]"></div>
            </div>
            Enable
           </label>
       </div>
        <p className="text-xs">Toggle whitelist on/off anytime.</p>
      </div>  */}

   {/* Liquidity tokens and liquidity percentage */}
<div className="flex flex-col xxs1:flex-row justify-between mb-4">
        <div className="xxs1:w-1/2 pr-2 mb-6">
          <label className="block text-[19px] mb-1"> Tokens Liquidity</label>
          <input
            type="number"
            {...register("tokensLiquidity")} // Register input field
             placeholder=" Tokens reserved for DEX liquidity"
            className={`w-full p-2 bg-[#333333] text-white rounded-md ${errors.tokensLiquidity ? "border-red-500" : "border-white no-spinner"
              }  border-b-2`}
            aria-label="Liquidity Tokens"
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === '+') {
                e.preventDefault();
              }
            }}
             min="0"
          />
          {errors.tokensLiquidity && (
            <p className="text-red-500 text-[15px]">{errors.tokensLiquidity.message}</p>
          )}
        </div>
        <div className="xxs1:w-1/2 xxs1:pl-2 mb-6">
          <label className="block text-[19px] mb-1">Liquidity Percentage</label>
          <input
            type="number"
            {...register("liquidityPercentage")} // Register input field
            placeholder=" Percentage of funds allocated to DEX liquidity"
            className={`w-full p-2 bg-[#333333] text-white rounded-md ${errors.maximumBuy ? "border-red-500" : "border-white no-spinner"
              }  border-b-2`}
            aria-label="Liquidity Percentage"
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === '+') {
                e.preventDefault();
              }
            }}
             min="0"
          />
          {errors.liquidityPercentage && (
            <p className="text-red-500 text-[15px]">{errors.liquidityPercentage.message}</p>
          )}
        </div>
      </div>

      {/* Minimum Buy and Maximum Buy */}
      <div className="flex flex-col xxs1:flex-row justify-between mb-4">
        <div className="xxs1:w-1/2 pr-2 mb-6">
          <label className="block text-[19px] mb-1">Minimum Contribution</label>
          <input
            type="number"
            {...register("minimumBuy")} // Register input field
             placeholder=" Minimum contribution per user"
            className={`w-full p-2 bg-[#333333] text-white rounded-md ${errors.minimumBuy ? "border-red-500" : "border-white no-spinner"
              }  border-b-2`}
            aria-label="Minimum Buy"
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === '+') {
                e.preventDefault();
              }
            }}
             min="0"
          />
          {errors.minimumBuy && (
            <p className="text-red-500 text-[15px]">{errors.minimumBuy.message}</p>
          )}
        </div>
        <div className="xxs1:w-1/2 xxs1:pl-2 mb-6">
          <label className="block text-[19px] mb-1">Maximum Contribution</label>
          <input
            type="number"
            {...register("maximumBuy")} // Register input field
            placeholder=" Maximum contribution per user"
            className={`w-full p-2 bg-[#333333] text-white rounded-md ${errors.maximumBuy ? "border-red-500" : "border-white no-spinner"
              }  border-b-2`}
            aria-label="Maximum Buy"
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === '+') {
                e.preventDefault();
              }
            }}
             min="0"
          />
          {errors.maximumBuy && (
            <p className="text-red-500 text-[15px]">{errors.maximumBuy.message}</p>
          )}
        </div>
      </div>

      {/* Start Time and End Time */}
      <div className="flex flex-col xxs1:flex-row justify-between mb-[50px] xxs1:mb-32">
        <div className="xxs1:w-1/2 pr-2 mb-6">
          <label className="block text-[19px] mb-1">Start Time</label>
          <input
            type="datetime-local"
            {...register("startTime")} // Register input field
            className={`w-full p-2 bg-[#333333] text-white rounded-md ${errors.startTime ? "border-red-500" : "border-white "
              }  border-b-2`}
            aria-label="Start Time"
          />
          {errors.startTime && (
            <p className="text-red-500 text-[14px]">{errors.startTime.message}</p>
          )}
        </div>
        <div className="xxs1:w-1/2 xxs1:pl-2 mb-6">
          <label className="block text-[19px] mb-1">End Time</label>
          <input
            type="datetime-local"
            {...register("endTime")} // Register input field
            className={`w-full p-2 bg-[#333333] text-white rounded-md ${errors.endTime ? "border-red-500" : "border-white"
              }  border-b-2`}
            aria-label="End Time"
          />
          {errors.endTime && (
            <p className="text-red-500 text-[14px]">{errors.endTime.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaunchpadInfoTab;