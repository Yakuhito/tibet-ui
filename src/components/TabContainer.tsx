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
    <div className="rounded-2xl max-w-screen-sm w-full">

      {/* Display buy/sell buttons */}
      {generateOfferData == null ? (
      <div className="flex gap-4 px-2 text-xl mb-4">
        <button
          className={`font-medium ${
            activeTab === 'swap' ? 'text-brandDark' : 'text-brandDark/50 hover:opacity-80'
            
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
            activeTab === 'liquidity' ? 'text-brandDark' : 'text-brandDark/50 hover:opacity-80'
          }`}
          onClick={() => {
            onPairSelect(null);
            setActiveTab('liquidity');
          }}
          >
          Liquidity
        </button>
      </div>) : (
        <div className="w-full mb-12">
          <div className="rounded-xl inline-flex hover:opacity-80 cursor-pointer" onClick={() => setGenerateOfferData(null)}>
            <p className="text-xl font-medium text-brandDark dark:text-brandLight">‹ Back</p>
          </div>
        </div>
      )}

      <div className="">{renderContent(setGenerateOfferData, generateOfferData)}</div>
    </div>
  );
};

export default TabContainer;
