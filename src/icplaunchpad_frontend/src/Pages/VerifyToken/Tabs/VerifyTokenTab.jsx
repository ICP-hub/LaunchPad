// import React, { useRef, useState } from 'react';
// import { FaRegCopy } from 'react-icons/fa'; 
// const VerifyTokenTab = ({ tokenData, setPresaleDetails }) => {
//   const [feeOption, setFeeOption] = useState(false);
//   const [currencyICP, setCurrencyICP] = useState(false);
//  const [copySuccess, setCopySuccess] = useState(false);
//    const inputRef = useRef(null);
//   // Function to handle currency ICP checkbox change
//   const handleCurrencyChange = () => {
//     setCurrencyICP(!currencyICP);
//     setPresaleDetails((prev) => ({ ...prev, currencyICP: !currencyICP }));
//   };

//   // Function to handle fee option checkbox change
//   const handleFeeOptionChange = () => {
//     setFeeOption(!feeOption);
//     setPresaleDetails((prev) => ({ ...prev, feeOption: !feeOption }));
//   };

 

//    const copyToClipboard = () => {
    
//      if (inputRef.current) {
//        navigator.clipboard
//          .writeText(inputRef.current.value)
//          .then(() => {
//            setCopySuccess(true);
//            setTimeout(() => setCopySuccess(false), 1000); 
//          })
//          .catch((err) => console.log("Failed to copy!", err));
//      }
//    };
//   return (
//     <div className="flex justify-center items-center mb-[120px] dxs:mb-[115px] xxs1:mb-[50px] sm2:mb-[40px] md:mb-[30px] dlg:mb-0 m-4 bg-black text-white">
//       <div className="bg-[#222222] w-full max-w-[1070px] h-[920px] xxs1:h-[850px] sm2:h-[780px] md:h-[730px] dlg:h-[780px] p-4 xxs1:p-8 rounded-2xl">
//         {/* Chain Text with Gray Background on mobile only */}
//         <div className="flex xxs1:hidden mb-8 bg-[rgb(68,68,68)] pl-6 p-2 mt-[-31px] mx-[-17px] xxs1:mx-[-31px] rounded-2xl">
//           <span className="text-white text-[22px]">Chain</span>
//         </div>

//         {/* Token Address */}
//         <h2 className="text-lg font-semibold mb-4">Token Address</h2>
//         {/* <input
//           type="text"
//           className="w-full py-2 pl-4 mb-4 bg-[#333333] text-[9px] ss3:text-[10px] xxs1:text-[17px] relative rounded-md"
//           placeholder="0xd8319f62626D0b2Fa5027A4ACFFbF52E319b1E7C0"
//           disabled
//         /> */}
//         <div className="relative w-full">
//           <input
//             ref={inputRef}
//             type="text"
//             className="w-full py-2 pl-4 pr-10 mb-4 bg-[#333333] text-[9px] ss3:text-[10px] xxs1:text-[17px] relative rounded-md"
//             value="0xd8319f62626D0b2Fa5027A4ACFFbF52E319b1E7C0"
//             readOnly
//             onClick={copyToClipboard}
//           />
//           <button
//             onClick={copyToClipboard}
//             className="absolute right-4 top-[36%] transform -translate-y-1/2 text-white text-[15px]"
//             aria-label="Copy to clipboard"
//           >
//             <FaRegCopy />
//           </button>
//         </div>
//         {copySuccess && (
//           <p className="text-green-400 text-sm mt-2">Copy successful</p>
//         )}
//         {/* Token Data Details */}
//         <div className="mb-8 mt-8">
//           <div className="flex justify-between border-b-2 py-1 border-[#FFFFFF80]">
//             <p>Name</p>
//             <p>{tokenData?.token_name || "N/A"}</p>
//           </div>
//           <div className="flex justify-between border-b-2 py-1 border-[#FFFFFF80]">
//             <p>Symbol</p>
//             <p>{tokenData?.token_symbol || "N/A"}</p>
//           </div>
//           <div className="flex justify-between border-b-2 py-1 border-[#FFFFFF80]">
//             <p>Decimals</p>
//             <p>{tokenData?.decimals || "N/A"}</p>
//           </div>
//           <div className="flex justify-between border-b-2 py-1 border-[#FFFFFF80]">
//             <p>Total Supply</p>
//             <p>{Number(tokenData?.total_supply) || 0}</p>
//           </div>
//         </div>

//         {/* Currency Selection */}
//         <div className="mb-4">
//           <p className="mb-2">Currency</p>
//           <label className="flex items-center ">
//             <input
//               type="checkbox"
//               checked={currencyICP}
//               onChange={handleCurrencyChange}
//               className="hidden peer "
//               required
//             />
//             <div className="w-4 h-4 bg-transparent border-2 border-white rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] flex items-center justify-center mr-2">
//               <div className="w-1.5 h-1.5 bg-transparent peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] rounded-full"></div>
//             </div>
//             ICP
//           </label>
//           <p className="text-gray-400 text-sm">
//             (User will pay with ICP for your token)
//           </p>
//         </div>

//         {/* Fee Options */}
//         <div className="mb-11">
//           <p className="mb-2">Fee Options</p>
//           <label className="flex items-center">
//             <input
//               type="checkbox"
//               checked={feeOption}
//               onChange={handleFeeOptionChange}
//               className="hidden peer"
//               required
//             />
//             <div className="w-4 h-4 bg-transparent border-2 border-white rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] flex items-center justify-center mr-2">
//               <div className="w-1.5 h-1.5 bg-transparent peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] rounded-full"></div>
//             </div>
//             5% ETH Raise Only
//           </label>
//         </div>

//         {/* Disclaimer Section */}
//         <div className="bg-[#F5F5F51A] text-white p-3 rounded-md dlg:mb-8">
//           <ul className="text-[12px] dxs:text-[15px] px-2 ss2:px-7 ss2:py-4 list-disc">
//             <li>
//               Lorem ipsum dolor sit amet consectetur. Egestas faucibus
//               suspendisse turpis cras sed bibendum massa arcu.
//             </li>
//             <li>
//               Quisque enim amet ipsum ipsum faucibus leo adipiscing molestie.
//               Tincidunt enim dis lobortis ac gravida. Non mollis lacus convallis
//               non sit ac sit.
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyTokenTab;


import React, { useRef, useState } from "react";
import { FaRegCopy } from "react-icons/fa";

const VerifyTokenTab = ({ register, errors, tokenData, watch }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const inputRef = useRef(null);

  // Watch the form values for feeOption and currencyICP to handle changes
  const feeOption = watch("feeOption");
  const currencyICP = watch("currencyICP");

  const copyToClipboard = () => {
    if (inputRef.current) {
      navigator.clipboard
        .writeText(inputRef.current.value)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 1000);
        })
        .catch((err) => console.log("Failed to copy!", err));
    }
  };

  return (
    <div className="flex justify-center items-center mb-[80px] dxs:mb-[145px] xxs1:mb-[80px] sm2:mb-[70px] md:mb-[30px] dlg:mb-0 m-4 bg-black text-white">
      <div className="bg-[#222222] w-full max-w-[1070px] h-[920px] xxs1:h-[850px] sm2:h-[780px] md:h-[730px] dlg:h-[780px] p-4 xxs1:p-8 rounded-2xl">
        {/* Chain Text with Gray Background on mobile only */}
        <div className="flex xxs1:hidden mb-8 bg-[rgb(68,68,68)] pl-6 p-2 mt-[-31px] mx-[-17px] xxs1:mx-[-31px] rounded-2xl">
          <span className="text-white text-[22px]">Chain</span>
        </div>

        {/* Token Address */}
        <h2 className="text-lg font-semibold mb-4">Token Address</h2>
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            className="w-full py-2 pl-4 pr-10 mb-4 bg-[#333333] text-[9px] ss3:text-[10px] xxs1:text-[17px] relative rounded-md"
            value="0xd8319f62626D0b2Fa5027A4ACFFbF52E319b1E7C0"
            readOnly
            onClick={copyToClipboard}
          />
          <button
            onClick={copyToClipboard}
            className="absolute right-4 top-[36%] transform -translate-y-1/2 text-white text-[15px]"
            aria-label="Copy to clipboard"
          >
            <FaRegCopy />
          </button>
        </div>
        {copySuccess && (
          <p className="text-green-400 text-sm mt-2">Copy successful</p>
        )}

        {/* Token Data Details */}
        <div className="mb-8 mt-8">
          <div className="flex justify-between border-b-2 py-1 border-[#FFFFFF80]">
            <p>Name</p>
            <p>{tokenData?.token_name || "N/A"}</p>
          </div>
          <div className="flex justify-between border-b-2 py-1 border-[#FFFFFF80]">
            <p>Symbol</p>
            <p>{tokenData?.token_symbol || "N/A"}</p>
          </div>
          <div className="flex justify-between border-b-2 py-1 border-[#FFFFFF80]">
            <p>Decimals</p>
            <p>{tokenData?.decimals || "N/A"}</p>
          </div>
          <div className="flex justify-between border-b-2 py-1 border-[#FFFFFF80]">
            <p>Total Supply</p>
            <p>{Number(tokenData?.total_supply) || 0}</p>
          </div>
        </div>

        {/* Currency Selection */}
        <div className="mb-4">
          <p className="mb-2">Currency</p>
          <label className="flex items-center ">
            <input
              type="checkbox"
              {...register("currencyICP")} // Register checkbox with react-hook-form
              checked={currencyICP}
              className="hidden peer"
            />
            <div className="w-4 h-4 bg-transparent border-2 border-white rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] flex items-center justify-center mr-2">
              <div className="w-1.5 h-1.5 bg-transparent peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] rounded-full"></div>
            </div>
            ICP
          </label>
          <p className="text-gray-400 text-sm">
            (User will pay with ICP for your token)
          </p>
        </div>

        {/* Fee Options */}
        <div className="mb-11">
          <p className="mb-2">Fee Options</p>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("feeOption")} // Register checkbox with react-hook-form
              checked={feeOption}
              className="hidden peer"
            />
            <div className="w-4 h-4 bg-transparent border-2 border-white rounded-full peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] flex items-center justify-center mr-2">
              <div className="w-1.5 h-1.5 bg-transparent peer-checked:bg-gradient-to-r from-[#f09787] to-[#CACCF5] rounded-full"></div>
            </div>
            5% ETH Raise Only
          </label>
        </div>

        {/* Disclaimer Section */}
        <div className="bg-[#F5F5F51A] text-white p-3 rounded-md dlg:mb-8">
          <ul className="text-[12px] dxs:text-[15px] px-2 ss2:px-7 ss2:py-4 list-disc">
            <li>
              Lorem ipsum dolor sit amet consectetur. Egestas faucibus
              suspendisse turpis cras sed bibendum massa arcu.
            </li>
            <li>
              Quisque enim amet ipsum ipsum faucibus leo adipiscing molestie.
              Tincidunt enim dis lobortis ac gravida. Non mollis lacus convallis
              non sit ac sit.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VerifyTokenTab;
