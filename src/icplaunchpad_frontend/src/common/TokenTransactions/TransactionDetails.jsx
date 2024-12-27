import React from 'react';
import { formatDateForDateTimeLocalPeriod } from '../../utils/formatDateFromBigInt';
import CopyToClipboard from '../CopyToClipboard';

const TransactionDetails = ({ transaction, index }) => {
  return (
    
    <tr className="text-sm xl:text-base ">
      <td className="py-1 px-2 sm:px-0 text-center align-middle" style={{ width: '10%' }}>
        {index + 1}
      </td>
      <td className="py-1 px-2 sm:px-0  text-center align-middle overflow-x-scroll no-scrollbar whitespace-nowrap" style={{ width: '20%' }}>
        {transaction?.kind}
      </td>
      <td className="py-1 px-2 sm:px-0 text-center align-middle overflow-x-scroll no-scrollbar whitespace-nowrap " style={{ width: '20%' }}>
        {Number(transaction?.[transaction?.kind][0]?.amount)} ICP
      </td>
      <td
        className="py-1 px-2 sm:px-0  text-center align-middle overflow-hidden whitespace-nowrap"
        style={{
          width: '20%',
          direction: 'rtl', 
          textOverflow: 'ellipsis',
        }}
      >
              {<CopyToClipboard address={(transaction?.[transaction?.kind][0]?.from) ? 
          transaction?.[transaction?.kind][0]?.from.owner.toString()
          :
          ""
        } isBgNone={true}  /> }
      </td>
      <td
  className="py-1 px-2 sm:px-0 text-center align-middle overflow-hidden whitespace-nowrap"
  style={{
    width: '20%',
    direction: 'rtl', 
    textOverflow: 'ellipsis',
  }}
>
  {
    <CopyToClipboard
      address={
        transaction?.[transaction?.kind]?.[0]?.to
          ? transaction?.[transaction?.kind]?.[0]?.to.owner.toString()
          : ""
      }
      isBgNone={true}
    />
  }
</td>

      <td className="py-1 px-2 sm:px-0 overflow-x-scroll no-scrollbar text-center align-middle whitespace-nowrap" style={{ width: '25%' }}>
        {formatDateForDateTimeLocalPeriod(transaction?.timestamp)}
      </td>
    </tr>
  );
};

export default TransactionDetails;
