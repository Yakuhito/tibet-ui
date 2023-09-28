import { getTokens } from '@/redux/globalOnLoadDataSlice';
import TabContainer from '../components/TabContainer';
import { type Token, getAllTokens } from '../api';
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks';
import Head from 'next/head';

const Home: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // Fetch all tokens
  const [tokens, setTokens] = useState<Token[] | null>(null);
  useEffect(() => {
    async function fetchTokens() {
      const allTokens = await getAllTokens();
      setTokens(allTokens);
    }
    fetchTokens();
  }, []);

  // Store tokens globally in Redux
  const dispatch = useAppDispatch();
  dispatch(getTokens())

  return (
    <>
      <Head>
        <title>TibetSwap | The First AMM on Chia</title>
      </Head>
      <main className="max-w-[28rem] mx-auto">
        <TabContainer tokens={tokens} selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
      </main>
    </>
  );
};

export default Home;
