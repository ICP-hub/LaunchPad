import React from 'react'
import Skeleton from 'react-loading-skeleton'

const TransactionsSkeleton = ({count}) => {
    return (
        Array(count).fill(0).map(() => (
            <tr className="text-base">
                <td className="py-3 px-6 text-center"> <Skeleton width={20} height={15} /> </td>
                <td className=" py-3 px-6 text-center"> <Skeleton width={50} height={15} /></td>
                <td className="py-3 px-6 text-center">  <Skeleton width={50} height={15} /> </td>
                <td className="py-3 px-6 text-center">  <Skeleton width={80} height={15} /> </td>
                <td className="py-3 px-6 text-center"> <Skeleton width={50} height={15} /> </td>
            </tr>)
        )

    )
}

export default TransactionsSkeleton