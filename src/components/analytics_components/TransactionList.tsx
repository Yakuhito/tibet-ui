import { formatDistanceToNow } from 'date-fns';
import React, { useState } from 'react';
import Link from 'next/link';
import { type ColumnDef } from '@tanstack/react-table'
import { useSelector } from 'react-redux';

import Table from './Table';



import { formatToken, mojoToXCHString } from '@/utils/analyticsUtils';
import { Transaction } from '@/analyticsApi';
import { RootState } from '@/redux/store';



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
        let swapAdd;
        let swapRemove;
        if (state_change.xch < 0) {
          swapRemove = "XCH";
          swapAdd = tokenShortName;
        } else {
          swapAdd = "XCH";
          swapRemove = tokenShortName;
        }
        return <span>Swap {swapAdd} for {swapRemove}</span>;
      case "REMOVE_LIQUIDITY":
        return <span>Remove XCH and {tokenShortName}</span>;
      default:
        return;
    }
  }

  const getAmountInString = (state_change: Transaction['state_change']) => {
    if (state_change.xch > 0) {
      const chiaFormatted = mojoToXCHString(Math.abs(state_change.xch), false);
      return `${chiaFormatted}`
    }
    const tokenFormatted = formatToken(Math.abs(state_change.token), false);
    return `${tokenFormatted} ${tokenShortName}`
  }

  const getAmountOutString = (state_change: Transaction['state_change']) => {
    if (state_change.xch > 0) {
      const tokenFormatted = formatToken(Math.abs(state_change.token), false);
      return `${tokenFormatted} ${tokenShortName}`
    }
    const chiaFormatted = mojoToXCHString(Math.abs(state_change.xch), false);
    return `${chiaFormatted}`
  }
  
  const XCHPrice = useSelector((state: RootState) => state.globalOnLoadData.xchPrice);

  const columns = React.useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        header: 'Operation',
        accessorKey: 'operation',
        cell: value => generateOperationSummary(value.row.original.operation, value.row.original.state_change),
      },
      {
        header: 'Amount In',
        accessorKey: 'state_change.xch',
        cell: value => getAmountInString(value.row.original.state_change),
      },
      {
        header: 'Amount Out',
        accessorKey: 'state_change.token',
        cell: value => getAmountOutString(value.row.original.state_change),
      },
      {
        header: 'Amount (USD)',
        accessorKey: 'state_change.xch',
        cell: value => XCHPrice ? "$" + (Math.abs(Number(value.getValue()) / (10 ** 12)) * XCHPrice).toFixed(1) : "",
      },
      {
        header: 'Time',
        accessorKey: 'timestamp',
        cell: timestamp => formatDistanceToNow(Number(timestamp.getValue())*1000, { addSuffix: true }).replace('about ', ''),
      },
    ],
    [XCHPrice]
  )
  
  
  return (
    <Table data={transactions} columns={columns} />
  );
};