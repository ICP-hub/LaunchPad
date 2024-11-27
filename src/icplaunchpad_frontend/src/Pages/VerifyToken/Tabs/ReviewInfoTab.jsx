import React from 'react';

const ReviewInfoTab = ({ presaleDetails }) => {
  console.log("REview side data", presaleDetails);
  return (
    <div className="bg-[#222222] p-2 xxs1:p-8 rounded-2xl mb-[80px] ss2:mb-[70px] dxs:mb-[140px] xxs1:mb-[80px] 
    sm3:mb-[60px] md:mb-[10px] mx-2 xxs1:mx-8 h-[1130px] xxs1:h-[1300px] sm3:h-[1230px]  md:h-[1050px] ">
      <table className="w-full text-left text-[8px]  sxs3:text-[10px] xxs1:text-[13px] pr-2 mb-4">
        <tbody>
          {[
            ["Total token", presaleDetails?.total_supply || "N/A"],
            ["Token name", presaleDetails?.token_name || "N/A"],
            ["Token symbol", presaleDetails?.token_symbol || "N/A"],
            ["Token decimals", presaleDetails?.decimals || "N/A"],
            [" Fairlaunch Token", presaleDetails?.FairlaunchTokens || "N/A"],
          
            // [
            //   "Sale method",
            //   presaleDetails?.currencyICP === true ? "ICP" : "N/A",
            // ],
            ["Softcap", presaleDetails?.softcapToken || "N/A"],
            ["Hardcap", presaleDetails?.hardcapToken || "N/A"],
            ["Minimum buy", presaleDetails?.minimumBuy || "N/A"],
            ["Maximum buy", presaleDetails?.maximumBuy || "N/A"],
            ["Start time", presaleDetails?.startTime || "N/A"],
            ["End time", presaleDetails?.endTime || "N/A"],
            ["Website", presaleDetails?.website || "N/A"],
            ["Video", presaleDetails?.project_video || "N/A"],
            // Add the description with a specific Tailwind box styling
          ].map(([label, value], idx) => (
            <tr key={idx} className="border-b border-gray-600">
              <td className="py-2">{label}</td>
              <td className="py-2 text-right text-gray-200">{value}</td>
            </tr>
          ))}

          <tr className="border-b border-gray-600">
            <td className="py-2">Social Links</td>
            <td className="py-2 text-right text-gray-200">
              {presaleDetails?.social_links?.length > 0
                ? presaleDetails.social_links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-400"
                    >
                      {link.url}
                    </a>
                  ))
                : "N/A"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Add description box with scroll handling and padding */}
      <div className="bg-[#F5F5F51A] p-3 rounded-md mb-8">
        <h3 className="text-white text-[14px] xxs1:text-[16px] mb-2">
          Description
        </h3>
        <div className="bg-[#333] p-4 rounded-lg overflow-y-auto no-scrollbar max-h-40">
          <p className="text-[12px] xxs1:text-[14px] text-gray-200 whitespace-pre-wrap">
            {presaleDetails?.description || "N/A"}
          </p>
        </div>
      </div>

      {/* Example text area */}
      <div className="bg-[#F5F5F51A] text-white p-3 rounded-md mb-8">
        <ul className="text-[13px] xxs1:text-[15px] px-3 xxs1:px-7 py-4 list-disc">
          <li>
            Verify Token Ownership: Ensure the legitimacy of your token by verifying ownership and confirming it’s authentic before proceeding with transactions or integration.
          </li>
          <li>
            Secure and Transparent Process: Use our streamlined process to validate your token with full transparency, ensuring that it meets the required standards for security and functionality.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewInfoTab;
