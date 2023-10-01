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
  
  const XCHPrice = useSelector((state: RootState) => state.globalOnLoadData.xchPrice);
  // Generate transaction table with filter
  const [transactionFilter, setTransactionFilter] = useState('ALL');

  const columns = React.useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        header: 'Operation',
        accessorKey: 'operation',
      },
      {
        header: 'Token 0',
        accessorKey: 'state_change.xch',
        cell: value => mojoToXCHString(Number(value.getValue()), true),
      },
      {
        header: 'Token 1',
        accessorKey: 'state_change.token',
        cell: value => formatToken(Number(value.getValue()), true),
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