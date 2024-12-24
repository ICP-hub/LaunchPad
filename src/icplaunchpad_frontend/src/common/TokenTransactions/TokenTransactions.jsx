import React, { useEffect, useState } from 'react';
import TransactionDetails from './TransactionDetails';
import FundListSkeleton from '../SkeletonUI/FundListSkeleton';
import NoDataFound from '../NoDataFound';
import { GrFormNextLink } from "react-icons/gr";
import { GrFormPreviousLink } from "react-icons/gr";
import TransactionsSkeleton from '../SkeletonUI/TransactionsSkeleton';

const TokenTransactions = ({ actor }) => {
  const [transactions, setTransactions] = useState([]);
  const [start, setStart] = useState(0);
  const [length] = useState(10); // Number of transactions per page
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (actor) {
      getTransactions(start, length);
    }
  }, [actor, start]);

  const getTransactions = async (startIndex, len) => {
    setIsLoading(true);
    try {
      console.log('Fetching transactions with actor:', actor);
      const response = await actor.get_transactions({ start: startIndex, length: len });
      const fetchedTransactions = response?.transactions || [];
         console.log(response)
      setTransactions(fetchedTransactions);
      setHasMore(fetchedTransactions.length === len); // If we received less than `len`, it means no more data.
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setStart(start + length);
    }
  };

  const handlePreviousPage = () => {
    if (start > 0) {
      setStart(start - length);
    }
  };

  return (
    <div className="min-h-[400px] text-gray-300 py-4 px-2 lg:px-2">
      <h2 className="text-[20px] font-bold text-white font-posterama mb-4"></h2>
      <div className="rounded-md">
        <table className="w-full table-fixed">
          <thead className="sticky top-0 bg-black bg-opacity-100 text-center text-white font-posterama uppercase text-sm leading-normal">
            <tr className='text-xs sm:text-sm xl:text-base'>
              <th className="py-3 lg:px-6 " style={{ width: '10%' }}>#</th>
              <th className="py-3 lg:px-6" style={{ width: '20%' }}>Method</th>
              <th className="py-3 lg:px-6" style={{ width: '20%' }}>Amount</th>
              <th className="py-3 lg:px-6" style={{ width: '25%' }}>Address</th>
              <th className="py-3 lg:px-6" style={{ width: '25%' }}>Time</th>
            </tr>
          </thead>
          <tbody className="w-full overflow-x-scroll no-scrollbar   text-white text-sm divide-y divide-[#FFFFFF33]">
            {isLoading ? (
              <TransactionsSkeleton count={5} />
            ) : transactions && transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <TransactionDetails
                  transaction={transaction}
                  index={start + index }
                  key={index}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-6 pt-10 text-center">
                  <NoDataFound
                    message="Transactions Not Found..."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex w-full bg-[#383838] p-2 mt-2 justify-between items-center">
          <h1 className=' text-xs lg:text-sm'>
            Showing {transactions.length} transactions from {start + 1} to {start + transactions.length}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={start === 0}
              className={`px-4 py- rounded ${start === 0 ? 'bg-black  cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
            >
              <GrFormPreviousLink/>
            </button>
            <button
              onClick={handleNextPage}
              disabled={!hasMore}
              className={`px-4 py-1 rounded ${!hasMore ? 'bg-black  cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
            >
              <GrFormNextLink/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenTransactions;
