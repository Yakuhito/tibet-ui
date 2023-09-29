import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Token, getAllTokens } from '../api';

import TabContainer from '@/components/trade_components/TabContainer';

const PairPreSelect: React.FC = () => {
  
  // Get pair short name from url
  const router = useRouter();
  const { pair_short_name } = router.query;
  
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

  // Pre-select asset on page load
  useEffect(() => {
    const getTokenFromShortName = (short_name: string | string[] | undefined) => {
      if (!tokens) return
      const token = tokens.filter(token => (
        token.short_name === short_name
      ))
      if (!token) return null
      return token[0]
    }

    if (!pair_short_name && !tokens) return
    const token = getTokenFromShortName(pair_short_name)
    if (!token) return
    setSelectedToken(token);
  }, [pair_short_name, tokens])

  return (
    <main className="max-w-[28rem] mx-auto">
      <TabContainer tokens={tokens} selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
    </main>
  );
};

export default PairPreSelect;
