import React, { useState, useEffect } from 'react';
import Swap from './Swap';
import { ActionType, Token, getAllTokens } from '../api';
import Liquidity from './Liquidity';

export interface GenerateOfferData {
  ask: [Token, boolean, number][]; // token, is_xch, amount
  receive: [Token, boolean, number][]; // token, is_xch, amount
  action: ActionType;
}

const TabContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'swap' | 'liquidity'>('swap');
  const [tokens, setTokens] = useState<Token[] | null>(null);
  const [generateOfferData, setGenerateOfferData] = useState<GenerateOfferData | null>(null);
 
  useEffect(() => {
    async function fetchTokens() {
      const allTokens = await getAllTokens();
      setTokens(allTokens);
    }

    fetchTokens();
  }, []);

  const renderContent = (generateOffer: (data: GenerateOfferData) => void) => {
    if (activeTab === 'swap') {
      return <Swap
        disabled={tokens == null}
        tokens={tokens}
        generateOffer={generateOffer}
      />;
    } else {
      return <Liquidity
        disabled={tokens == null}
        tokens={tokens}
        generateOffer={generateOffer}
      />;
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md max-w-screen-sm w-[calc(3/5*100%)] m-4">
      {generateOfferData == null ? (<div className="flex">
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
      </div>) : (
        <div className='flex text-center'>Generate Offer</div>
      )}

      <div className="border-t border-gray-300">{renderContent(setGenerateOfferData)}</div>
    </div>
  );
};

export default TabContainer;
