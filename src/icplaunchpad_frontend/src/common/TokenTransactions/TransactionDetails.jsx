import React from 'react';
import { formatDateForDateTimeLocal } from '../../utils/formatDateFromBigInt';
import CopyToClipboard from '../CopyToClipboard';

const TransactionDetails = ({ transaction, index }) => {
  return (
    
    <tr className="text-xs sm:text-sm xl:text-base ">
      <td className="py-1 lg:px-4 text-center align-middle" style={{ width: '10%' }}>
        {index + 1}
      </td>
      <td className="py-1 lg:px-4 text-center align-middle overflow-x-scroll no-scrollbar whitespace-nowrap" style={{ width: '20%' }}>
        {transaction?.kind}
      </td>
      <td className="py-1 lg:px-4 text-center align-middle overflow-x-scroll no-scrollbar whitespace-nowrap " style={{ width: '20%' }}>
        {Number(transaction?.mint[0]?.amount)}
      </td>
      <td
        className="py-1 lg:px-4 text-center align-middle overflow-hidden text-ellipsis whitespace-nowrap"
        style={{ width: '25%' }}
      >
          {<CopyToClipboard address={transaction?.mint[0]?.to?.owner.toString()} isBgNone={true}  /> }
      </td>
      <td className="py-1 lg:px-4 overflow-x-scroll no-scrollbar text-center align-middle whitespace-nowrap" style={{ width: '25%' }}>
        {formatDateForDateTimeLocal(transaction?.timestamp)}
      </td>
    </tr>
  );
};

export default TransactionDetails;
