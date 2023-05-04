import { Token, getAllTokens } from '../api';
import TabContainer from '../components/TabContainer';
import { useState, useEffect } from 'react';

const Home: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [pairLauncherId, setPairLauncherId] = useState<string | null>(null);
  const link = process.env.NEXT_PUBLIC_INFO_BASE_URL + (
    pairLauncherId === null ? "" : `/pair/${pairLauncherId}`
  );

  // Fetch all tokens
  const [tokens, setTokens] = useState<Token[] | null>(null);
  useEffect(() => {
    async function fetchTokens() {
      const allTokens = await getAllTokens();
      setTokens(allTokens);
    }
    fetchTokens();
  }, []);

  return (
      <main className="max-w-[28rem]">
        <TabContainer tokens={tokens} onPairSelect={setPairLauncherId} selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
      </main>
  );
};

export default Home;
