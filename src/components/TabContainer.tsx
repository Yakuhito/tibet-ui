import React, { useState, useEffect } from 'react';
import { type Token, ActionType } from '../api';
import Liquidity from './Liquidity/Liquidity';
import GenerateOffer from './GenerateOffer';
import Swap from './Swap/Swap';

export interface GenerateOfferData {
  pairId: string;
  offer: [Token, boolean, number][]; // token, is_xch, amount
  request: [Token, boolean, number][]; // token, is_xch, amount
  action: ActionType;
}

export interface TabContainerProps {
  tokens: Token[] | null;
  selectedToken: Token | null;
  setSelectedToken: React.Dispatch<React.SetStateAction<Token | null>>;
}

const TabContainer: React.FC<TabContainerProps> = ({ tokens, selectedToken, setSelectedToken }) => {
  const emergency_withdraw = process.env.NEXT_PUBLIC_V1_EMERGENCY_WITHDRAW === "true";

  const SWAP_ENABLED = !emergency_withdraw && process.env.NEXT_PUBLIC_SWAP_ENABLED === 'true';
  const [activeTab, setActiveTab] = useState<'swap' | 'liquidity'>(SWAP_ENABLED ? 'swap' : 'liquidity');
  const [generateOfferData, setGenerateOfferData] = useState<GenerateOfferData | null>(null);
  const [orderRefreshActive, setOrderRefreshActive] = useState(false)
  const [devFee, setDevFee] = useState(0.003)
  const [dataRefreshPercent, setDataRefreshPercent] = useState(0);

  // Remember & restore user dev fee preference (if >= 0.3%)
  useEffect(() => {
    const devFee = localStorage.getItem('devFee');
    if (devFee && parseFloat(devFee) >= 0.003) {
      setDevFee(parseFloat(devFee));
    }
  }, []);

  // Update data refresh loader percent
  useEffect(() => {
    if(generateOfferData !== null && orderRefreshActive && activeTab === 'swap') {
      var interval = setInterval(() => {
          setDataRefreshPercent(percent => (percent < 100 ? percent + 1 : percent));
      }, 50); // Update every 50 milliseconds
    } else {
      setDataRefreshPercent(0)
    }
      return () => {
        clearInterval(interval);
      };
    }, [generateOfferData, orderRefreshActive, activeTab]);

  const renderContent = (generateOffer: (data: GenerateOfferData) => void, data: GenerateOfferData | null) => {
    if(data !== null) {
      return <GenerateOffer data={data} setOrderRefreshActive={setOrderRefreshActive} devFee={devFee} dataRefreshPercent={dataRefreshPercent} setGenerateOfferData={setGenerateOfferData} setDataRefreshPercent={setDataRefreshPercent} activeTab={activeTab} />;
    }

    if (activeTab === 'swap') {
      return <Swap
        disabled={tokens == null}
        tokens={tokens}
        generateOffer={generateOffer}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        devFee={devFee}
        setDevFee={setDevFee}
      />;
    } else {
      return <Liquidity
        disabled={tokens == null}
        tokens={tokens}
        generateOffer={generateOffer}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
      />;
    }
  };

  return (
    <div className="rounded-2xl max-w-screen-sm w-full">
      <h1 className="text-[2.75rem] leading-10 sm:text-5xl font-bold pb-4">{generateOfferData ? 'Order Summary' : 'Trade'}</h1>

      {/* Display swap/liquidity toggle */}
      {generateOfferData == null ? (
      <div className="flex gap-4 px-2 text-xl mb-4 mt-8">
        <button
          className={`font-medium ${
            activeTab === 'swap' ? 'text-black dark:text-brandLight' : 'text-black/50 dark:text-brandLight/50 hover:opacity-80'
            
          }`}
          onClick={() => {
            if(SWAP_ENABLED) {
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
            activeTab === 'liquidity' ? 'text-black dark:text-brandLight' : 'text-black/50 dark:text-brandLight/50 hover:opacity-80'
          }`}
          onClick={() => {
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
