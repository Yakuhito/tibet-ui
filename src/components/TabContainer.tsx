import React, { useState, useEffect } from 'react';
import Swap from './Swap';
import { ActionType, Token, getAllTokens } from '../api';
import Liquidity from './Liquidity';
import GenerateOffer from './GenerateOffer';

export interface GenerateOfferData {
  pairId: string;
  offer: [Token, boolean, number][]; // token, is_xch, amount
  request: [Token, boolean, number][]; // token, is_xch, amount
  action: ActionType;
}

export interface TabContainerProps {
  onPairSelect: (pairLauncherId: string | null) => void;
}

const TabContainer: React.FC<TabContainerProps> = ({ onPairSelect }) => {
  const emergency_withdraw = process.env.NEXT_PUBLIC_V1_EMERGENCY_WITHDRAW === "true";

  const SWAP_ENABLED = !emergency_withdraw && process.env.NEXT_PUBLIC_SWAP_ENABLED === 'true';
  const [activeTab, setActiveTab] = useState<'swap' | 'liquidity'>(SWAP_ENABLED ? 'swap' : 'liquidity');
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
        onPairSelect={onPairSelect}
      />;
    } else {
      return <Liquidity
        disabled={tokens == null}
        tokens={tokens}
        generateOffer={generateOffer}
        onPairSelect={onPairSelect}
      />;
    }
  };

  return (
    <div className="bg-white rounded-2xl max-w-screen-sm md:w-[calc(3/5*100%)] p-8">

      {/* Display buy/sell buttons */}
      {generateOfferData == null ? (
      <div className="flex gap-4 px-4 text-xl mb-4">
        <button
          className={`font-medium ${
            activeTab === 'swap' ? 'text-brandDark' : 'text-brandDark/80 hover:opacity-80'
          }`}
          onClick={() => {
            if(SWAP_ENABLED) {
              onPairSelect(null);
              setActiveTab('swap')
            } else {
              if(emergency_withdraw) {
                alert("Swapping has been disabled - please withdraw your liquidity ASAP!");
              } else {
                alert("Swapping is currently disabled - check back soon!");
              }
            }
          }}
        >
          Swap
        </button>
        <button
          className={`font-medium ${
            activeTab === 'liquidity' ? 'text-brandDark' : 'text-brandDark/80 hover:opacity-80'
          }`}
          onClick={() => {
            onPairSelect(null);
            setActiveTab('liquidity');
          }}
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

      <div className="">{renderContent(setGenerateOfferData, generateOfferData)}</div>
    </div>
  );
};

export default TabContainer;
