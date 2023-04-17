import React, { useState, useEffect } from 'react';
import Swap from './Swap';
import { ActionType, Token, getAllTokens } from '../api';
import Liquidity from './Liquidity';
import GenerateOffer from './GenerateOffer';

export interface GenerateOfferData {
  pairId: string;
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

  const renderContent = (generateOffer: (data: GenerateOfferData) => void, data: GenerateOfferData | null) => {
    if(data !== null) {
      return <GenerateOffer data={data}/>;
    }

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
        <div className='flex p-4'>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            className="h-4 mt-1"
            onClick={() => setGenerateOfferData(null)}
          >
            <path d="M11,14 L2,8 L11,2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className='text-center w-full'>
            Generate Offer
          </p>
        </div>
      )}

      <div className="border-t border-gray-300">{renderContent(setGenerateOfferData, generateOfferData)}</div>
    </div>
  );
};

export default TabContainer;
