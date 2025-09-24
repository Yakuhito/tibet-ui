import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Pair, getAllPairs } from '../api';

import TabContainer from '@/components/trade_components/TabContainer';

const PairPreSelect: React.FC = () => {
  
  // Get pair short name from url
  const router = useRouter();
  const { pair_short_name } = router.query;
  
  const [selectedPair, setSelectedPair] = useState<Pair | null>(null);

  // Fetch all pairs
  const [pairs, setPairs] = useState<Pair[] | null>(null);
  useEffect(() => {
    async function fetchPairs() {
      const allPairs = await getAllPairs();
      setPairs(allPairs);
    }
    fetchPairs();
  }, []);

  // Pre-select asset on page load
  useEffect(() => {
    const getPairFromShortName = (short_name: string | string[] | undefined) => {
      if (!pairs) return
      const pair = pairs.filter(pair => (
        short_name === pair.asset_short_name
      ))
      if (!pair) return null
      return pair[0]
    }

    if (!pair_short_name && !pairs) return
    const pair = getPairFromShortName(pair_short_name)
    if (!pair) return
    setSelectedPair(pair);
  }, [pair_short_name, pairs])

  return (
    <main className="max-w-[28rem] mx-auto">
      <TabContainer pairs={pairs} selectedPair={selectedPair} setSelectedPair={setSelectedPair} />
    </main>
  );
};

export default PairPreSelect;
