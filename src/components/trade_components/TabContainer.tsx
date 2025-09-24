import { useSelector } from 'react-redux';
import React, { useState } from 'react';

import { ActionType, Token, type Pair } from '../../api';

import CompleteWithWalletModal from './CompleteWithWalletModal';
import GenerateOffer from './GenerateOffer';
import Liquidity from './Liquidity';
import Swap from './Swap';

import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/hooks';
import { setDevFee as setReduxDevFee } from '@/redux/devFeeSlice';

export interface GenerateOfferData {
  pairId: string;
  offer: [Token, boolean, number][]; // token, is_xch, amount
  request: [Token, boolean, number][]; // token, is_xch, amount
  action: ActionType;
}

export interface TabContainerProps {
  pairs: Pair[] | null;
  selectedPair: Pair | null;
  setSelectedPair: React.Dispatch<React.SetStateAction<Pair | null>>;
}

const TabContainer: React.FC<TabContainerProps> = ({ pairs, selectedPair, setSelectedPair }) => {
  const emergency_withdraw = process.env.NEXT_PUBLIC_V1_EMERGENCY_WITHDRAW === "true";

  const SWAP_ENABLED = !emergency_withdraw && process.env.NEXT_PUBLIC_SWAP_ENABLED === 'true';
  const [activeTab, setActiveTab] = useState<'swap' | 'liquidity'>(SWAP_ENABLED ? 'swap' : 'liquidity');
  const [generateOfferData, setGenerateOfferData] = useState<GenerateOfferData | null>(null);


  const dispatch = useAppDispatch();
  const devFee = useSelector((state: RootState) => state.devFee.devFee);
  const setDevFee = (fee: number) => {
    dispatch(setReduxDevFee(fee))
  }

  const renderContent = (generateOffer: (data: GenerateOfferData) => void, data: GenerateOfferData | null) => {
    if(data !== null) {
      return <GenerateOffer data={data} devFee={devFee} setGenerateOfferData={setGenerateOfferData} activeTab={activeTab} />;
    }

    if (activeTab === 'swap') {
      return <Swap
        disabled={pairs == null}
        pairs={pairs}
        generateOffer={generateOffer}
        selectedPair={selectedPair}
        setSelectedPair={setSelectedPair}
        devFee={devFee}
        setDevFee={setDevFee}
      />;
    } else {
      return <Liquidity
        disabled={pairs == null}
        pairs={pairs}
        generateOffer={generateOffer}
        selectedPair={selectedPair}
        setSelectedPair={setSelectedPair}
      />;
    }
  };

  return (
    <div className="rounded-2xl max-w-screen-sm w-full">
      <CompleteWithWalletModal />
      <h1 className="text-[2.75rem] leading-10 sm:text-5xl font-bold pb-4">{generateOfferData ? 'Order Summary' : 'Trade'}</h1>

      {/* Display swap/liquidity toggle */}
      {generateOfferData == null ? (
      <div className="flex gap-4 px-2 text-xl mt-2">
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
        <div className="w-full mb-8 mt-2">
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
