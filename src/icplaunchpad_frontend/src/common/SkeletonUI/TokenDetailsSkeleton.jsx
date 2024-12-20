import React from 'react';
import Skeleton from 'react-loading-skeleton';

const TokenDetailsSkeleton = () => {
  return (
    <div className="text-gray-300 p-6 rounded-lg w-full max-w-full">
      {/* Token Address Skeleton */}
      <div className="flex justify-between mb-4">
        <span>
          <Skeleton width={80} height={15} />
        </span>
        <span className="border-b-2 ml-2 text-right overflow-hidden text-ellipsis whitespace-nowrap">
          <Skeleton width={150} height={15} />
        </span>
      </div>
      <p className="text-xs mb-6">
        <Skeleton width={250} height={12} />
      </p>

      {/* Token Details Skeleton */}
      <div className="border-t pt-4">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="flex border-b-2 justify-between py-2">
              <span>
                <Skeleton width={100} height={15} />
              </span>
              <span>
                <Skeleton width={100} height={15} />
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TokenDetailsSkeleton;
