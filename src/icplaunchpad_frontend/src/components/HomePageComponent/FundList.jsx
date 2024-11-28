import React from 'react';
import { useSelector } from 'react-redux';
import FundDetails from './FundDetails';


const FundList = () => {
  const SuccesFullSales = useSelector((state) => state.SuccessfulSales.data);

  return (
    <div className="px-[8%] py-[5%] md:py-[6%] lg:py-[3%] bg-black">
      <h2 className="text-[30px] font-bold text-white font-posterama mb-4">
        {/* SUCCESSFUL PROJECTS RAISE FUNDING */}
        Where Ideas Meet Funding Success
      </h2>
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto no-scrollbar">
        <table className="min-w-full bg-black border-b border-[#FFFFFF33]">
          <thead>
            <tr className="bg-[#1919194D] text-white font-posterama uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Projects</th>
              <th className="py-3 px-6 text-left">Symbol</th>
              <th className="py-3 px-6 text-left">Total Raised</th>
              <th className="py-3 px-6 text-left">Fairlaunch</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Ended In</th>
            </tr>
          </thead>
          {console.log('SuccesFullSales=',SuccesFullSales)}
          <tbody className="text-white text-sm divide-y    divide-[#FFFFFF33]">
            {SuccesFullSales && SuccesFullSales.length > 0 ? (
              SuccesFullSales.map((sale, index) => (
                <FundDetails sale={sale[0]} index={index}/>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-3 px-6 text-center">No Successful Sales Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FundList;