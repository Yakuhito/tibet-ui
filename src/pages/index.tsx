import { Token, getAllTokens } from '../api';
import TabContainer from '../components/TabContainer';
import { useState, useEffect } from 'react';

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

  return (
      <main className="max-w-[28rem] mx-auto">
        <h1 className="text-5xl font-bold pb-12">Trade</h1>
        <TabContainer tokens={tokens} selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
      </main>
  );
};

export default Home;
