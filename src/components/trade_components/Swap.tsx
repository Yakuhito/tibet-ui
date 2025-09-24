import { useState, useEffect } from 'react';

import { type Token, type Pair, getPairByLauncherId, getInputPrice, getOutputPrice, ActionType, pairToToken } from '../../api';
import GenerateOfferButton from '../shared/GenerateOfferButton';
import TickIcon from '../shared/icons/TickIcon';
import CogIcon from '../shared/icons/CogIcon';

import type { GenerateOfferData } from './TabContainer';
import SwapInput from './SwapInput';

import { setIsOpen } from '@/redux/settingsModalSlice';
import { UNKNWN, XCH } from '@/shared_tokens';
import { useAppDispatch } from '@/hooks';


type SwapProps = {
  disabled: boolean;
  pairs: Pair[] | null;
  generateOffer: (data: GenerateOfferData) => void;
  selectedPair: Pair | null;
  setSelectedPair: React.Dispatch<React.SetStateAction<Pair | null>>;
  devFee: number;
  setDevFee: (value: number) => void;
};

const Swap: React.FC<SwapProps> = ({ disabled, pairs, generateOffer, selectedPair, setSelectedPair, devFee, setDevFee }) => {
  const dispatch = useAppDispatch();

  const [pair, setPair] = useState<Pair | null>(null);
  const [isBuySelected, setIsBuySelected] = useState(true);
  const [amount0, setAmount0] = useState(0);
  const [amount1, setAmount1] = useState(0);

  useEffect(() => {
    if(selectedPair && selectedPair.asset_hidden_puzzle_hash === null && devFee !== 0.007) {
      setDevFee(0.007);
    } else if(selectedPair && selectedPair.asset_hidden_puzzle_hash !== null && devFee !== 0.0) {
      setDevFee(0.0);
    }
  }, [selectedPair, devFee, setDevFee]);

  // Update token pair details every 5 seconds
  useEffect(() => {
    async function updatePair(): Promise<Pair | null> {
      if(selectedPair !== null) {
        const newPair = await getPairByLauncherId(selectedPair!.pair_id);

        if(
          newPair.pair_id !== pair?.pair_id ||
          newPair.liquidity !== pair?.liquidity ||
          newPair.xch_reserve !== pair?.xch_reserve ||
          newPair.token_reserve !== pair?.token_reserve ||
          newPair.asset_id !== pair?.asset_id ||
          newPair.asset_hidden_puzzle_hash !== pair?.asset_hidden_puzzle_hash ||
          newPair.inverse_fee !== pair?.inverse_fee
        ) {
          setPair(newPair);
          return newPair;
        }
      }

      return null;
    }

    async function update() {
      if(selectedPair === null) return;

      var currentPair: Pair | null = pair;
      if(pair === null || selectedPair?.pair_id !== pair.pair_id) {
        currentPair = (await updatePair()) ?? pair;
      }

      if(currentPair !== null && currentPair.xch_reserve > 0 && currentPair.token_reserve > 0) {
        if(isBuySelected) {
          setAmount0(10 ** 12);
          setAmount1(getInputPrice(10 ** 12, currentPair.xch_reserve, currentPair.token_reserve, currentPair.inverse_fee));
        } else {
          setAmount1(1000);
          setAmount0(getInputPrice(1000, currentPair.token_reserve, currentPair.xch_reserve, currentPair.inverse_fee));
        }
      }
   }

    update();

    const interval = setInterval(() => {
      updatePair();
    }, 5000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPair, isBuySelected, pair]);

  const setSelectedPairAndWarn = (p: Pair) => {
    if(!p.asset_verified) {
      alert(`WARNING: This token has not been labeled as 'verified' by the TibetSwap team. Please make sure you truly want to transact with asset id 0x${p.asset_id} before proceeding.`);
    }

    setSelectedPair(p);
  }

  // Calculate & update price impact and store in state
  const [priceImpact, setPriceImpact] = useState(0)
  useEffect(() => {
    // Formula used:
    // y = token_b_liquidity_pool
    // dy = number of tokens the user will get (based on their input)
    // price_impact = (y - dy)**2 / y**2 - 1
    if (!pair) return
    const y = isBuySelected ? pair?.token_reserve : pair?.xch_reserve;
    const dy = isBuySelected ? amount1 : amount0;
    const price_impact = -((y - dy)**2 / y**2 - 1);
    price_impact < 0.1 && setHighPriceImpactConfirmed(false);
    setPriceImpact(price_impact);
  },[amount0, amount1, isBuySelected, pair]);


  const submitSwapOperation = () => {
    const sideOne: [Token, boolean, number][] = [
      [XCH, true, amount0]
    ];
    const sideTwo: [Token, boolean, number][] = [
      [pairToToken(pair!), false, amount1]
    ];

    if(isBuySelected) {
      generateOffer({
        pairId: pair!.pair_id,
        offer: sideOne,
        request: sideTwo,
        action: ActionType.SWAP
      });
    } else {
      generateOffer({
        pairId: pair!.pair_id,
        offer: sideTwo,
        request: sideOne,
        action: ActionType.SWAP
      });
    }
  };

  // State management for high price impact banner user confirmation checkbox
  const [highPriceImpactConfirmed, setHighPriceImpactConfirmed] = useState(false);

  const selectedToken = pair ? pairToToken(pair) : null;

  return (
    <div className="w-fill">

      <SwapInput
        token0={XCH}
        token1={selectedToken ?? UNKNWN}
        isBuySelected={isBuySelected}
        onArrowClick={() => setIsBuySelected(!isBuySelected)}
        amount0={amount0}
        amount1={amount1}
        onAmountsChanged={(newAmount0, newAmount1: number) => {
            if(amount0 !== newAmount0) {
              setAmount0(newAmount0);

              if(isBuySelected) {
                setAmount1(getInputPrice(newAmount0, pair?.xch_reserve ?? 0, pair?.token_reserve ?? 0, pair?.inverse_fee ?? 993));
              } else {
                setAmount1(getOutputPrice(newAmount0, pair?.token_reserve ?? 0, pair?.xch_reserve ?? 0, pair?.inverse_fee ?? 993));
              }
            } else if(amount1 !== newAmount1) {
              setAmount1(newAmount1);

              if(isBuySelected) {
                setAmount0(getOutputPrice(newAmount1, pair?.xch_reserve ?? 0, pair?.token_reserve ?? 0, pair?.inverse_fee ?? 993));
              } else {
                setAmount0(getInputPrice(newAmount1, pair?.token_reserve ?? 0, pair?.xch_reserve ?? 0, pair?.inverse_fee ?? 993));
              }
            }
        }}
        disabled={pair == null}
        selectPair={setSelectedPairAndWarn}
      />

      {/* High price impact warning banner */}
      { priceImpact >= 0.1 && (
      <div className="bg-red-400/50 dark:bg-red-400/20 rounded-xl text-red-700 dark:text-red-600 p-4 mt-8 flex items-center gap-4 -mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="opacity-0 absolute h-0 w-0 peer"
              checked={highPriceImpactConfirmed}
              onChange={() => setHighPriceImpactConfirmed(!highPriceImpactConfirmed)}
            />
            <div className="bg-slate-100 dark:bg-zinc-900 rounded-md w-6 h-6 border peer-checked:bg-red-700 border-red-700 dark:border-red-600 flex items-center justify-center">
              {highPriceImpactConfirmed && (
                <TickIcon className="fill-brandLight w-4 h-4 stroke-[3px] stroke-brandLight" />
              )}
            </div>
          </div>
        </label>
        <p className="font-medium text-sm">The <a href="https://coinmarketcap.com/alexandria/glossary/price-impact" target="_blank" className="underline">price impact</a> for this trade is very high. Tick the box on the left to continue.</p>
      </div>
      )
      }

      <GenerateOfferButton
        isBuySelected={isBuySelected}
        disabled={selectedToken == null || pair == null || priceImpact >= 0.1 && !highPriceImpactConfirmed || amount0 === 0}
        onPressed={submitSwapOperation}
      />

      {/* Price details Section */}
      { selectedToken !== null && pair !== null && amount0 !== 0 && (
        <div className="flex flex-col p-6 rounded-2xl mt-2 gap-1 text-sm">
          {/* Price */}
          <div className="flex justify-between w-full">
            <p>Price</p>
            <p className="font-medium">1 {selectedToken?.short_name} = {parseFloat((amount0/amount1/1000000000).toFixed(8))} {process.env.NEXT_PUBLIC_XCH}</p>
          </div>

          {/* Price Impact */}
          <div className="flex justify-between w-full">
            <p>Price impact</p>
            <p className={`font-medium ${priceImpact >= 0.1 ? 'text-red-700' : ''}`}>{(priceImpact * 100).toFixed(2) + '%'}</p>
          </div>

          {/* Liquidity Fee */}
          <div className="flex justify-between w-full">
            <p>Liquidity fee</p>
            <p className="font-medium">{((1000 - pair.inverse_fee) / 100.0).toFixed(2) + '%'}</p>
          </div>

          {/* Dev Fee */}
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-1">
              <p>Dev fee</p>
              {/* <CogIcon className="w-4 mb-[-1px] hover:rotate-45 transition fill-brandDark cursor-pointer dark:fill-brandLight" onClick={() => dispatch(setIsOpen(true))} /> */}
            </div>
            <p className="font-medium">{(devFee * 100).toFixed(2) + '%'}</p>
          </div>
          
        </div>
        )
      }
    </div>
  );
};

export default Swap;
