import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { formatToken, mojoToXCHString } from '@/utils/analyticsUtils';
import { Pair } from '@/analyticsApi';


interface PairListProps {
  pairs: Pair[];
}

export const PairList: React.FC<PairListProps> = ({ pairs }) => {
  
  const [sortColumn, setSortColumn] = useState<keyof Pair>('xch_reserve');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const handleSort = (columnName: keyof Pair) => {
    if (sortColumn === columnName) {
      // If the same column is clicked again, toggle the sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If a different column is clicked, update the sorting column and set the default sort order
      setSortColumn(columnName);
      setSortOrder('asc');
    }
  };

  // Sort the data
  let sortedPairs = [...pairs];
  if (sortColumn && sortOrder) {
    sortedPairs.sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (sortOrder === 'asc') {
        return valueA < valueB ? -1 : 1;
      } else {
        return valueA > valueB ? -1 : 1;
      }
    });
  }

  const generate_tbody = () => sortedPairs.map(pair => (
    <Link key={pair.launcher_id} href={`/pair/${pair.launcher_id}`} className="contents">
      <tr className="hover:opacity-60 align-middle dark:text-brandLight">
        <td className="flex items-center gap-3 h-16 pl-4">
          <Image
            src={pair.image_url}
            alt="Img"
            height={24}
            width={24}
            className="rounded-full"
          />
          <p className="max-w-[22rem] inline-flex gap-2">
            <span className="hidden sm:block text-ellipsis overflow-hidden">{pair.name}</span>
            <span className="sm:text-brandDark/50 dark:sm:text-brandLight/50 sm:before:content-['('] sm:after:content-[')']">{pair.short_name}</span>
          </p>
        </td>
        <td className="pr-4 text-right hidden xl:table-cell">{mojoToXCHString(pair.xch_reserve)}</td>
        <td className="pr-4 text-right hidden xl:table-cell">{formatToken(pair.token_reserve)} {pair.short_name}</td>
        <td className="pr-4 text-right hidden md:table-cell">{formatToken(pair.liquidity)} tokens</td>
        <td className="pr-4 text-right">{mojoToXCHString(pair.trade_volume)}</td>
      </tr>
    </Link>
    
  )
  );

  return (
    <table className="w-full font-medium whitespace-nowrap animate-fadeIn">
      <thead className="text-left text-brandDark/90 sticky top-24 bg-brandLight/80 dark:bg-zinc-900/80">
        <tr className="h-16 sm:text-xl backdrop-blur dark:text-brandLight/80">
          <th><span onClick={() => handleSort('name')} className={`bg-brandDark/10 px-4 rounded-full py-1 select-none cursor-pointer hover:opacity-80 ${sortColumn !== 'name' ? '' : sortOrder === 'desc' ? "after:content-['_▾'] after:text-red-700" : "after:content-['_▴'] after:text-green-700"}`}>Token</span></th>
          <th className="text-right hidden xl:table-cell"><span onClick={() => handleSort('xch_reserve')} className={`bg-brandDark/10 px-4 rounded-full py-1 select-none cursor-pointer hover:opacity-80 ${sortColumn !== 'xch_reserve' ? '' : sortOrder === 'desc' ? "after:content-['_▾'] after:text-red-700" : "after:content-['_▴'] after:text-green-700"}`}>XCH Reserve</span></th>
          <th className="text-right hidden xl:table-cell"><span onClick={() => handleSort('token_reserve')} className={`bg-brandDark/10 px-4 rounded-full py-1 select-none cursor-pointer hover:opacity-80 ${sortColumn !== 'token_reserve' ? '' : sortOrder === 'desc' ? "after:content-['_▾'] after:text-red-700" : "after:content-['_▴'] after:text-green-700"}`}>Token Reserve</span></th>
          <th className="text-right hidden md:table-cell"><span onClick={() => handleSort('liquidity')} className={`bg-brandDark/10 px-4 rounded-full py-1 select-none cursor-pointer hover:opacity-80 ${sortColumn !== 'liquidity' ? '' : sortOrder === 'desc' ? "after:content-['_▾'] after:text-red-700" : "after:content-['_▴'] after:text-green-700"}`}>Liquidity</span></th>
          <th className="text-right"><span onClick={() => handleSort('trade_volume')} className={`bg-brandDark/10 px-4 rounded-full py-1 select-none cursor-pointer hover:opacity-80 ${sortColumn !== 'trade_volume' ? '' : sortOrder === 'desc' ? "after:content-['_▾'] after:text-red-700" : "after:content-['_▴'] after:text-green-700"}`}>Trade Volume</span></th>
        </tr>
      </thead>
      <tbody>
        {generate_tbody()}
      </tbody>
    </table>
  );
};
