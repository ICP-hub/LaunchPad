import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FundDetails from './FundDetails';
import NoDataFound from '../../common/NoDataFound';
import FundListSkeleton from '../../common/SkeletonUI/FundListSkeleton';

const FundList = () => {
  const SuccesFullSales = useSelector((state) => state.SuccessfulSales);
  console.log('SuccesFullSales==',SuccesFullSales?.data)


  return (
    <div className="px-[9%] py-[5%] md:py-[6%] lg:py-[3%] bg-black">
      <h2 className="text-[30px] font-bold text-white font-posterama mb-4">
        Where Ideas Meet Funding Success
      </h2>
      <div className="overflow-x-auto max-h-[400px] no-scrollbar rounded-md">
        <table className="min-w-full bg-black">
          <thead className="sticky top-0 bg-[#19191998] bg-opacity-100 text-center text-white font-posterama uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6">#</th>
              <th className="py-3 px-6">Projects</th>
              <th className="py-3 px-6">Symbol</th>
              <th className="py-3 px-6">Total Raised</th>
              <th className="py-3 px-6">Fairlaunch</th>
              <th className="py-3 px-6">Type</th>
              <th className="py-3 px-6">Ended In</th>
            </tr>
          </thead>
          <tbody className="text-white text-sm divide-y divide-[#FFFFFF33]">
            {SuccesFullSales?.loading ?
            <FundListSkeleton count={5}/>
            :
            (SuccesFullSales?.data && SuccesFullSales?.data.length > 0) ? (
              SuccesFullSales?.data.map((sale, index) => (
                <FundDetails sale={sale[0]} index={index} key={index} />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-3 px-6 pt-10 text-center">
                  <NoDataFound
                    message="No Successful Sales Found..."
                    message2="No tokens have been successfully raised for this project yet."
                    message3="Kickstart your fundraising journey by creating and sharing your campaign."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FundList;
