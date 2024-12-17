import React from 'react'
import Skeleton from 'react-loading-skeleton'

const FundListSkeleton = ({count=1}) => {
    return (
        Array(count).fill(0).map(()=>(
            <tr  className="text-base">
            <td className="py-3 px-6 text-center"> <Skeleton width={20} height={15} /> </td>
            <td className=" py-3 px-6">
                <span className='flex text-center justify-center 
              '>
                   <Skeleton circle height={20} width={20} className='mr-1' />
                   <Skeleton width={60} height={15} className='mt-[6px]' />
                </span>
            </td>
            <td className="py-3 px-6 text-center">  <Skeleton width={50} height={15} /> </td>
            <td className="py-3 px-6 text-center">  <Skeleton width={50} height={15} /> </td>
            <td className="py-3 px-6 text-center"> <Skeleton width={60} height={15} /> </td>
            <td className="py-3 px-6 text-center">  <Skeleton width={60} height={15} /> </td>
            <td className="py-3 px-6 text-center">  <Skeleton width={80} height={15} /> </td>
        </tr>)
        )

    )
}

export default FundListSkeleton