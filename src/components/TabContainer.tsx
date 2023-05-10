import { getInputPrice, getPairByLauncherId, ActionType } from '../api';
import React, { useState, useEffect } from 'react';
import GenerateOffer from './GenerateOffer';
import Liquidity from './Liquidity';
import type { Token } from '../api';
import Swap from './Swap';

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


  // Update order rates every 5 seconds
  useEffect(() => {
    if(generateOfferData !== null) { // Only start interval if an original offer exists
      const updateOfferData = async () => {
        const data = {...generateOfferData}
        const isBuy = data.offer[0][0].short_name === "XCH"
        const { xch_reserve, token_reserve } = await getPairByLauncherId(data.pairId) // Get latest reserve amounts

        if (isBuy) {
          const amount0 = data.offer[0][2]
          const amount1 = getInputPrice(amount0, xch_reserve, token_reserve) // Get updated token quote
          data.request[0][2] = amount1
          setGenerateOfferData(data)
          console.log("Updating offer data")
        } else {
          const amount1 = data.offer[0][2]
          const amount0 = getInputPrice(amount1, token_reserve, xch_reserve) // Get updated XCH quote
          data.request[0][2] = amount0;
          console.log("Updating offer data")
          setGenerateOfferData(data)
        }
      }
      var updateOfferDataInterval = setInterval(updateOfferData, 5000)
  }
  return () => clearInterval(updateOfferDataInterval)
  }, [generateOfferData])



  const renderContent = (generateOffer: (data: GenerateOfferData) => void, data: GenerateOfferData | null) => {
    if(data !== null) {
      return <GenerateOffer data={data} />;
    }

    if (activeTab === 'swap') {
      return <Swap
        disabled={tokens == null}
        tokens={tokens}
        generateOffer={generateOffer}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
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

      {/* Display buy/sell buttons */}
      {generateOfferData == null ? (
      <div className="flex gap-4 px-2 text-xl mb-4">
        <button
          className={`font-medium ${
            activeTab === 'swap' ? 'text-brandDark' : 'text-brandDark/50 hover:opacity-80'
            
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
            activeTab === 'liquidity' ? 'text-brandDark' : 'text-brandDark/50 hover:opacity-80'
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
