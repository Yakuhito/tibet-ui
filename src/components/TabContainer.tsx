import { getInputPrice, getPairByLauncherId, ActionType, getLiquidityQuote } from '../api';
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
  const [orderRefreshActive, setOrderRefreshActive] = useState(true)
  const [devFee, setDevFee] = useState(0.003)
  const [dataRefreshPercent, setDataRefreshPercent] = useState(0);


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


  // Update order rates every 5 seconds
  useEffect(() => {
    if(generateOfferData !== null && orderRefreshActive) { // Only start interval if an original offer exists
      
      // Update Swap Offer Data Function
      const updateOfferDataSwap = async () => {
        const data = {...generateOfferData};
        const isBuy = data.offer[0][0].short_name === "XCH";
        const { xch_reserve, token_reserve } = await getPairByLauncherId(data.pairId); // Get latest reserve amounts

        if (isBuy) {
          const amount0 = data.offer[0][2]
          const amount1 = getInputPrice(amount0, xch_reserve, token_reserve); // Get updated token quote
          data.request[0][2] = amount1;
          generateOfferData !== null ? setGenerateOfferData(data) : null;
          console.log("Updating offer data");
        } else {
          const amount1 = data.offer[0][2];
          const amount0 = getInputPrice(amount1, token_reserve, xch_reserve); // Get updated XCH quote
          data.request[0][2] = amount0;
          console.log("Updating offer data");
          generateOfferData !== null ? setGenerateOfferData(data) : null;
        }

        setDataRefreshPercent(0)
      }
      
      // Update Liquidity Offer Data Function
      const updateOfferDataLiquidity = async () => {
        const data = {...generateOfferData};
        const isAddLiquidity = data.action === "ADD_LIQUIDITY";
        const { xch_reserve, token_reserve, liquidity } = await getPairByLauncherId(data.pairId); // Get latest reserve amounts
        const pairLiquidity = liquidity;
        
        
        if (isAddLiquidity) {
          const tokenAmount = data.offer[1][2];
          const liquidity = getLiquidityQuote(tokenAmount, token_reserve, pairLiquidity, false);
          console.log(liquidity)
          var xchAmount = getLiquidityQuote(tokenAmount, token_reserve, xch_reserve, false);
          xchAmount += liquidity;

          data.offer[0][2] = xchAmount; // Update Amount0
          data.request[0][2] = liquidity; // Update Amount2

          console.log("Updating offer data");
          generateOfferData !== null ? setGenerateOfferData(data) : null;
        } else {
          const liquidityTokens = data.offer[0][2]
          const tokenAmount = getLiquidityQuote(liquidityTokens, pairLiquidity, token_reserve, true);
          var xchAmount = getLiquidityQuote(liquidityTokens, liquidity, xch_reserve, true);
          xchAmount += liquidity;
          
          data.request[0][2] = xchAmount; // Update Amount0
          data.request[1][2] = tokenAmount; // Update Amount1

          console.log("Updating offer data");
          generateOfferData !== null ? setGenerateOfferData(data) : null;
        }

      }

      // Set Interval
      var updateOfferDataInterval = setInterval(activeTab === 'swap' ? updateOfferDataSwap : updateOfferDataLiquidity, 5000)
  }
  return () => clearInterval(updateOfferDataInterval)
  }, [generateOfferData, orderRefreshActive, activeTab])



  const renderContent = (generateOffer: (data: GenerateOfferData) => void, data: GenerateOfferData | null) => {
    if(data !== null) {
      return <GenerateOffer data={data} setOrderRefreshActive={setOrderRefreshActive} devFee={devFee} dataRefreshPercent={dataRefreshPercent} />;
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
