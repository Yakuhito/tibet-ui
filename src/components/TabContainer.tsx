import React, { useState, useEffect } from 'react';
import Swap from './Swap';
import { Token, getAllTokens } from '../api';

const TabContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'swap' | 'liquidity'>('swap');
  const [tokens, setTokens] = useState<Token[] | null>(null);
 
  useEffect(() => {
    async function fetchTokens() {
      const allTokens = await getAllTokens();
      setTokens(allTokens);
    }

    fetchTokens();
  }, []);

  const renderContent = () => {
    if (activeTab === 'swap') {
      return <Swap disabled={tokens == null} tokens={tokens} />;
    } else {
      return <p className="p-4">Liquidity</p>;
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md max-w-screen-sm w-[calc(3/5*100%)] m-4">
    <div className="flex">
      <button
        className={`w-1/2 p-4 text-center ${
          activeTab === 'swap' ? 'underline' : ''
        }`}
        onClick={() => setActiveTab('swap')}
      >
        Swap
      </button>
      <button
        className={`w-1/2 p-4 text-center ${
          activeTab === 'liquidity' ? 'underline' : ''
        }`}
        onClick={() => setActiveTab('liquidity')}
      >
          Liquidity
        </button>
      </div>
      <div className="border-t border-gray-300">{renderContent()}</div>
    </div>
  );
};

export default TabContainer;
