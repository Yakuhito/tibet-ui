import { useState, useEffect } from 'react';
import Head from 'next/head';

import { type Pair, getAllPairs } from '../api';

import TabContainer from '@/components/trade_components/TabContainer';
import { getPairs } from '@/redux/globalOnLoadDataSlice';
import { useAppDispatch } from '@/hooks';


const Home: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<Pair | null>(null);

  // Fetch all tokens
  const [pairs, setPairs] = useState<Pair[] | null>(null);
  useEffect(() => {
    async function fetchPairs() {
      const allPairs = await getAllPairs();
      setPairs(allPairs);
    }
    fetchPairs();
  }, []);

  // Store tokens globally in Redux
  const dispatch = useAppDispatch();
  dispatch(getPairs())

  return (
    <>
      <Head>
        <title>TibetSwap | The Leading Chia AMM</title>
      </Head>
      <main className="max-w-[28rem] mx-auto">
        <TabContainer pairs={pairs} selectedPair={selectedPair} setSelectedPair={setSelectedPair} />
      </main>
    </>
  );
};

export default Home;
