import React from 'react';
import Skeleton from 'react-loading-skeleton';

const PoolDetailsSkeleton = () => {
  return (
    <div className="text-gray-300 p-6 rounded-lg w-full max-w-full">
      {/* Address Skeleton */}
      <div className="flex justify-between gap-1 mb-6">
        <span>
          <Skeleton width={80} height={15} />
        </span>
        <span className="border-b-2 overflow-hidden text-right">
          <Skeleton width={150} height={15} />
        </span>
      </div>

      {/* Token Details Skeleton */}
      <div className="border-t pt-4">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="flex justify-between border-b py-2">
              <span>
                <Skeleton width={100} height={15} />
              </span>
              <span>
                <Skeleton width={120} height={15} />
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PoolDetailsSkeleton;
