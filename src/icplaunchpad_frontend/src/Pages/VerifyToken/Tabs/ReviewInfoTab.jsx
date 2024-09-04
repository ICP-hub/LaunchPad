import React from 'react';

const ReviewInfoTab = () => {
  return (
    <div className="bg-[#222222] p-8 rounded-md h-[1150px]">
      <table className="w-full text-left text-sm  mb-4">
        <tbody>
          {[
            ["Total token", "585.000 ICP"],
            ["Token name", "Chambs"],
            ["Token symbol", "CHAMBS"],
            ["Token decimals", "18"],
            ["Presale rate", "2000 ICP"],
            ["Listing rate", "2000 ICP"],
            ["Sale method", "Public"],
            ["Softcap", "100 BNB"],
            ["Hardcap", "200 BNB"],
            ["Minimum buy", "1 BNB"],
            ["Maximum buy", "2 BNB"],
            ["Start time", "2023-12-13T16:45 (UTC)"],
            ["End time", "2023-12-14T16:40 (UTC)"],
            ["Website", "https://pinksale.finance"],
            ["Facebook", "https://facebook.com/pinksaleTEST"],
            ["Twitter", "https://twitter.com/pinkecosystem"],
            ["Telegram", "https://t.me/pinkecosystem"],
            ["Github", "https://github.com/pinksaleTEST"],
            ["Instagram", "https://instagram.com/pinksaleTEST"],
            ["Discord", "https://discord.com/pinksaleTEST"],
            ["Reddit", "https://reddit.com/pinksaleTEST"],
            ["Description", "PinkSale helps everyone to create their own tokens and token sales in few seconds. Tokens created on"],
            ["Youtube Video", "https://www.youtube.com/watch?v=NHlyrXmcC8ss"],
          ].map(([label, value], idx) => (
            <tr key={idx} className="border-b border-gray-600">
              <td className="py-2">{label}</td>
              <td className="py-2 text-right text-gray-200">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-[#F5F5F51A]  text-white p-3 rounded-md mb-8">
            <ul className='text-[15px] px-7 py-4 list-disc '>
            <li>  Lorem ipsum dolor sit amet consectetur. Egestas faucibus suspendisse turpis cras sed bibendum massa arcu.</li>
            <li> Quisque enim amet ipsum ipsum faucibus leo adipiscing molestie. Tincidunt enim dis lobortis ac gravida. Non mollis lacus convallis non sit ac sit.</li>
            </ul>
          </div> 
          <div className=' justify-center items-center'>
          <button 
          className='border-1   bg-gradient-to-r from-[#F3B3A7] to-[#CACCF5] 
          text-black  relative w-[120px] lg:w-[211px] h-[35px] lg:h-[35px]
             text-[10px] md:text-[18px] font-[600] rounded-2xl'
          >
            Next
          </button>
          </div>
    </div>
  );
};

export default ReviewInfoTab;
