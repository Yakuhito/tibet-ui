import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import { Pair, Transaction, getPair, getTransactions } from '@/analyticsApi';
import { TransactionList } from '@/components/analytics_components/TransactionList';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { formatToken, mojoToXCHString } from '@/utils/analyticsUtils';
import { CustomCard } from '@/components/analytics_components/CustomCard';

export default function PairDetails() {

  // Get pair ID from url
  const router = useRouter();
  const { pair_id } = router.query;

  // Number of transactions to get from API at once
  const PAGINATION = 42;

  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [moreTxesAvailable, setMoreTxesAvailable] = useState(false);
  const [loadingMoreTxes, setLoadingMoreTxes] = useState(false);
  const [pair, setPair] = useState<Pair | null>(null);
  const [loading, setLoading] = useState(true);

  // On page load, fetch pair details and transactions
  useEffect(() => {
    async function fetchData() {
      try {
        const [pairData, transactionsData] = await Promise.all([getPair(pair_id as string), getTransactions(pair_id as string, PAGINATION)]);
        setMoreTxesAvailable(transactionsData.length === PAGINATION);
        setTransactions(transactionsData);
        setLoading(false);
        setPair(pairData);
      } catch (error) {
        alert('Error fetching data :(');
      }
    }

    // Only fetch pair data when id is fetched from router
    if(pair_id) {
      fetchData();
    }
  }, [pair_id]);

  // Handle pagination
  const loadMoreTxes = async () => {
    if(loadingMoreTxes || !moreTxesAvailable) return;
    setLoadingMoreTxes(true);
    const newTxes = await getTransactions(pair_id as string, PAGINATION, transactions?.length ?? 0);
    setMoreTxesAvailable(newTxes.length === PAGINATION);
    setTransactions([
      ...(transactions ?? []),
      ...newTxes
    ]);
    setLoadingMoreTxes(false);
  };

  // Only render if pair exists
  if (pair === null) return

  return (
    <main>
      {/* Token info Section */}
      <section>

        {/* Breadcrumb */}
        <div className="flex items-center gap-4 select-none">
          <Link href="/analytics" className="text-xl font-medium text-brandDark/90 hover:opacity-60 dark:text-brandLight/80">Home</Link>
          <p className="text-xl font-medium text-brandDark dark:text-brandLight">›</p>
          <p className="text-xl font-medium text-brandDark dark:text-brandLight">{pair.short_name}</p>
        </div>

        {/* Token Name */}
        <div className="flex flex-col gap-4 py-12 pt-16">
          <Image
              src={pair.image_url}
              alt="Token Image"
              height={64}
              width={64}
              className={`${loading ? 'invisible' : 'animate-fadeIn'} rounded-full`}
            />
          <h1 className="font-bold text-5xl">
            {pair.name}
            <span className="text-brandDark/50 font-bold text-xl ml-2 sm:ml-4 dark:text-brandLight/50">({pair.short_name})</span>
          </h1>
        </div>

        {/* Stats */}
        <div className={`${loading ? 'animate-pulse' : ''} w-full px-4 py-8 md:py-12 rounded-3xl flex flex-col lg:flex-row md:justify-evenly gap-8 bg-brandDark bg-gradient-to-br from-[#7fa9b8] to-brandDark dark:from-brandDark dark:to-[#152f38]`}>
          <CustomCard title={`${process.env.NEXT_PUBLIC_XCH} Reserve`} value={loading ? '0' : mojoToXCHString(pair.xch_reserve)} subtitle="managed by pair" loading={loading} />
          <CustomCard title={`${pair.short_name} Reserve`} value={loading ? '0' : `${formatToken(pair.token_reserve)} ${pair.short_name}`} subtitle="managed by pair" loading={loading} />
          <CustomCard title="Liquidity" value={loading ? '0' : `${formatToken(pair.liquidity)}`} subtitle="liquidity tokens across all holders" loading={loading} />
        </div>
      </section>


      {/* Latest Transactions Section */}
      <section className="mb-20">
        <h2 className="font-bold text-5xl py-8 pt-16 pb-12">Transactions</h2>
        <div className="flex flex-col items-center">
          {transactions && !loading && (
            <TransactionList
              transactions={transactions}
              tokenShortName={pair.short_name}
              moreTxesAvailable={moreTxesAvailable}
              loadingMoreTxes={loadingMoreTxes}
              loadMoreTxes={loadMoreTxes}
            />
          )}

          {/* Load more transactions button */}
          {moreTxesAvailable && !loading &&
          <button className="bg-brandDark text-brandLight px-6 rounded-xl h-[40px] font-bold w-full mt-8 hover:opacity-90 lg:max-w-[10rem] flex justify-center items-center" onClick={loadMoreTxes}>
            {loadingMoreTxes ? <LoadingSpinner /> : 'Load More' }
          </button>
          }
        </div>
      </section>

    </main>
  );
}