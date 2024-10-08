import React from 'react';

const ReviewInfoTab = ({ presaleDetails }) => {

  return (
    <div className="bg-[#222222] p-4 xxs1:p-8  rounded-2xl mb-[120px] xxs1:mb-[50px] sm3:mb-8 mx-2 xxs1:mx-8 h-[1340px] xxs1:h-[1450px] sm3:h-[1350px] md:h-[1250px] lg:h-[1150px]">
      <table className="w-full text-left text-[10px] xxs1:text-[14px] pr-2 mb-4">
        <tbody>
          {[
            ["Total token", presaleDetails?.total_supply || "N/A"],
            ["Token name", presaleDetails?.token_name || "N/A"],
            ["Token symbol", presaleDetails?.token_symbol || "N/A"],
            ["Token decimals", presaleDetails?.decimals || "N/A"],
            ["Presale rate", presaleDetails?.presaleRate || "N/A"],
            ["Listing rate", presaleDetails?.listingRate || "N/A"],
            ["Sale method", presaleDetails?.currencyICP == true ?  "ICP" : "N/A"],
            ["Softcap", presaleDetails?.softcapToken || "N/A"],
            ["Hardcap", presaleDetails?.hardcapToken|| "N/A"],
            ["Minimum buy", presaleDetails?. minimumBuy|| "N/A"],
            ["Maximum buy", presaleDetails?. maximumBuy || "N/A"],
            ["Start time", presaleDetails?.startTime || "N/A"],
            ["End time", presaleDetails?.endTime || "N/A"],
            ["Website", presaleDetails?.website || "N/A"],
            ["Facebook", presaleDetails?.facebook || "N/A"],
            ["Twitter", presaleDetails?.twitter || "N/A"],
            ["Telegram", presaleDetails?.telegram || "N/A"],
            ["Github", presaleDetails?.github || "N/A"],
            ["Instagram", presaleDetails?.instagram || "N/A"],
            ["Discord", presaleDetails?.discord || "N/A"],
            ["Reddit", presaleDetails?.reddit || "N/A"],
            ["Description", presaleDetails?.description || "N/A"],
            ["Youtube Video", presaleDetails?.youtubeVideo || "N/A"],
          ].map(([label, value], idx) => (
            <tr key={idx} className="border-b border-gray-600">
              <td className="py-2">{label}</td>
              <td className="py-2 text-right text-gray-200">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-[#F5F5F51A] text-white p-3 rounded-md mb-8">
        <ul className="text-[13px] xxs1:text-[15px] px-3 xxs1:px-7 py-4 list-disc">
          <li>Lorem ipsum dolor sit amet consectetur. Egestas faucibus suspendisse turpis cras sed bibendum massa arcu.</li>
          <li>Quisque enim amet ipsum ipsum faucibus leo adipiscing molestie. Tincidunt enim dis lobortis ac gravida. Non mollis lacus convallis non sit ac sit.</li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewInfoTab;
