import React, { useEffect, useState } from 'react';

import { formatDollars, mojoToXCHString } from '@/utils/analyticsUtils';
import { CustomCard } from '@/components/analytics_components/CustomCard';
import { PairList } from '@/components/analytics_components/PairList';
import { getStats, getPairs, Stats, Pair } from '@/analyticsApi';


async function getXCHPrice(): Promise<number | null> {
  try {
    const resp = await fetch("https://xchscan.com/api/chia-price");
    const resp_parsed = await resp.json();
    return resp_parsed.usd;
  } catch(_) {
    return null;
  }
}

const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pairs, setPairs] = useState<Pair[] | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const loading = stats === null;

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, pairsData, priceData] = await Promise.all([
          getStats().then(stats => {
            setStats(stats);
          }),
          getPairs().then(pairs => {
            setPairs(pairs);
          }),
          getXCHPrice().then(price => {
            setPrice(price);
          })
        ]);
      } catch (error) {
        alert('Error fetching data :(');
      }
    }

    fetchData();
    const intervalId = setInterval(fetchData, 30000); // 30 seconds

    return () => {
      clearInterval(intervalId); // Clean up the interval when the component is unmounted
    };
  }, []);

  const tvlString = loading ? '' : mojoToXCHString(stats!.total_value_locked);
  const ttvString = loading ? '' : mojoToXCHString(stats!.total_trade_volume);

  var tvlPrice = "Fetching price...";
  var ttvPrice = "Fetching price...";
  if(price !== null && stats !== null) {
    tvlPrice = formatDollars(stats.total_value_locked * price / (10 ** 12));
    ttvPrice = formatDollars(stats.total_trade_volume * price / (10 ** 12));
  }
  return (
    <main>

      {/* Analytics Section */}
      <section>
        <h1 className="font-bold text-5xl py-12">Analytics</h1>
        <div className={`${loading ? 'animate-pulse' : ''} w-full px-4 py-8 md:py-12 rounded-xl flex flex-col lg:flex-row md:justify-evenly gap-8 bg-brandDark bg-gradient-to-br from-[#7fa9b8] to-brandDark dark:from-brandDark dark:to-[#152f38]`}>
          <CustomCard title="Transactions" value={loading ? '0' : stats!.transaction_count.toLocaleString('en-US')} loading={loading}/>
          <CustomCard title="Total Value Locked" value={loading ? '0' : tvlString} subtitle={loading ? '0' : tvlPrice} loading={loading} />
          <CustomCard title="Total Trade Volume" value={loading ? '0' : ttvString} subtitle={loading ? '0' : ttvPrice} loading={loading} />
        </div>
      </section>


      {/* Pairs Table Section */}
      <section>
        <h3 className="font-bold text-5xl py-8 pt-16">Pairs</h3>

        {pairs && (
          <div className="px-4 pb-20">
            <PairList pairs={pairs}/>
          </div>
        )}
      </section>
    </main>
  );
};

export default StatsPage;