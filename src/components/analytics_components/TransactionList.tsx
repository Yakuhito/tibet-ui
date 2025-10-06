import { formatDistanceToNow } from 'date-fns';
import React, { useState } from 'react';
import Link from 'next/link';

import { formatToken, mojoToXCHString } from '@/utils/analyticsUtils';
import { Transaction } from '@/analyticsApi';


interface TransactionListProps {
  transactions: Transaction[];
  tokenShortName: string;
  moreTxesAvailable: boolean;
  loadingMoreTxes: boolean;
  loadMoreTxes: () => void;
}


export const TransactionList: React.FC<TransactionListProps> = ({ transactions, tokenShortName, moreTxesAvailable, loadingMoreTxes, loadMoreTxes }) => {

  function generateOperationSummary(operation: Transaction['operation'], state_change: Transaction['state_change']) {
    switch (operation) {
      case "ADD_LIQUIDITY":
        return <span>Add {tokenShortName} and XCH</span>;
      case "SWAP":
        if (state_change.xch == 0) {
          return <span>Issuer: Rebase rCAT reserve</span>;
        }

        let swapAdd;
        let swapRemove;
        if (state_change.xch < 0) {
          swapRemove = "XCH";
          swapAdd = tokenShortName;
        } else {
          swapAdd = "XCH";
          swapRemove = tokenShortName;
        }
        return <span>Swap {swapAdd} to {swapRemove}</span>;
      case "REMOVE_LIQUIDITY":
        return <span>Remove XCH and {tokenShortName}</span>;
      default:
        return;
    }
  }

  // Generate transaction table with filter
  const [transactionFilter, setTransactionFilter] = useState('ALL');
  
  let filteredTransactions = transactions;
  if (transactionFilter !== 'ALL') {
    filteredTransactions = transactions.filter(
      (transaction) => transaction.operation === transactionFilter
    );
  }

  const generate_tbody = () => filteredTransactions.map(transaction => (
    <tr className="align-middle text-right" key={transaction.coin_id}>
      <td className="truncate max-w-[225px] text-brandDark dark:text-brandLight text-left h-16 pl-4"><Link target="_blank" className="hover:opacity-60" href={process.env.NEXT_PUBLIC_SPACESCAN_BASE_URL + transaction.coin_id}>{generateOperationSummary(transaction.operation, transaction.state_change)}</Link></td>
      <td className="pr-4 hidden lg:table-cell">{mojoToXCHString(transaction.state_change.xch, true)}</td>
      <td className="pr-4 hidden lg:table-cell">{formatToken(transaction.state_change.token, true)} {tokenShortName}</td>
      <td className="pr-4 hidden lg:table-cell">{formatDistanceToNow(transaction.timestamp*1000, { addSuffix: true }).replace('about ', '')}</td>
      <td className="pr-4 lg:hidden text-sm font-medium">
        <p className={`${transaction.state_change.xch < 0 ? 'text-red-800 dark:text-red-700' : 'text-green-800 dark:text-green-600'}`}>{mojoToXCHString(transaction.state_change.xch, true)}</p>
        <p className={`${transaction.state_change.token < 0 ? 'text-red-800 dark:text-red-700' : 'text-green-800 dark:text-green-600'}`}>{formatToken(transaction.state_change.token, true)} {tokenShortName}</p>
      </td>
    </tr>
  ));

  return (
      <table className="w-full font-medium whitespace-nowrap">
        <thead className="text-left text-brandDark/90 dark:text-brandLight/80 sticky top-24 bg-brandLight/80 dark:bg-zinc-900/80">
          <tr className="h-16 sm:text-xl backdrop-blur relative">
            <th>
              {/* Type filter */}
              <ul className="absolute lg:relative -translate-y-1/2 lg:translate-y-0 bg-brandDark/10 rounded-full p-1 inline-flex select-none text-brandDark/90 dark:text-brandLight/80 font-bold overflow-x-auto max-w-full text-sm sm:gap-2 sm:text-xl">
                <li className={`${transactionFilter === 'ALL' ? 'bg-brandDark text-brandLight' : ''}  px-3 sm:px-4 rounded-full cursor-pointer hover:opacity-90`} onClick={() => setTransactionFilter('ALL')}>All</li>
                <li className={`${transactionFilter === 'SWAP' ? 'bg-brandDark text-brandLight' : ''} px-3 sm:px-4 rounded-full cursor-pointer hover:opacity-90`} onClick={() => setTransactionFilter('SWAP')}>Swaps</li>
                <li className={`${transactionFilter === 'ADD_LIQUIDITY' ? 'bg-brandDark text-brandLight' : ''} px-3 sm:px-4 rounded-full cursor-pointer hover:opacity-90`} onClick={() => setTransactionFilter('ADD_LIQUIDITY')}>Adds</li>
                <li className={`${transactionFilter === 'REMOVE_LIQUIDITY' ? 'bg-brandDark text-brandLight' : ''} px-3 sm:px-4 rounded-full cursor-pointer hover:opacity-90`} onClick={() => setTransactionFilter('REMOVE_LIQUIDITY')}>Removes</li>
              </ul>
            </th>
            <th className="text-right hidden lg:table-cell"><span className='bg-brandDark/10 px-4 rounded-full py-1'>Token0 Amount</span></th>
            <th className="text-right hidden lg:table-cell"><span className='bg-brandDark/10 px-4 rounded-full py-1'>Token1 Amount</span></th>
            <th className="text-right hidden lg:table-cell"><span className='bg-brandDark/10 px-4 rounded-full py-1'>Time</span></th>
            <th className="text-right"><span className='bg-brandDark/10 px-4 text-sm sm:text-xl rounded-full py-1 lg:hidden'>Change</span></th>
          </tr>
        </thead>
        <tbody>
          {generate_tbody()}
        </tbody>
      </table>
  );
};
