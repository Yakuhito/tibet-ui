import { useState, useEffect } from 'react';
import { Token, Pair, getPairByLauncherId, getInputPrice, getOutputPrice, ActionType } from '../api';
import BooleanSwitch from './BooleanSwitch';
import TokenSelector from './TokenSelector';
import SwapInput from './SwapInput';
import GenerateOfferButton from './GenerateOfferButton';
import { UNKNWN, XCH } from '@/shared_tokens';
import { GenerateOfferData } from './TabContainer';

type SwapProps = {
  disabled: boolean;
  tokens: Token[] | null;
  generateOffer: (data: GenerateOfferData) => void;
  selectedToken: Token | null;
  setSelectedToken: React.Dispatch<React.SetStateAction<Token | null>>;
};

const Swap: React.FC<SwapProps> = ({ disabled, tokens, generateOffer, selectedToken, setSelectedToken }) => {
  const [pair, setPair] = useState<Pair | null>(null);
  const [isBuySelected, setIsBuySelected] = useState(true);
  const [amount0, setAmount0] = useState(0);
  const [amount1, setAmount1] = useState(0);

  useEffect(() => {
    async function updatePair(): Promise<Pair | null> {
      if(selectedToken !== null) {
        const newPair = await getPairByLauncherId(selectedToken!.pair_id);

        if(
          newPair.launcher_id !== pair?.launcher_id ||
          newPair.liquidity !== pair?.liquidity ||
          newPair.xch_reserve !== pair?.xch_reserve ||
          newPair.token_reserve !== pair?.token_reserve
        ) {
          setPair(newPair);
          return newPair;
        }
      }

      return null;
    }

    async function update() {
      if(selectedToken === null) return;

      var currentPair: Pair | null = pair;
      if(pair === null || selectedToken?.pair_id !== pair.launcher_id) {
        currentPair = (await updatePair()) ?? pair;
      }

      if(currentPair !== null && currentPair.xch_reserve > 0 && currentPair.token_reserve > 0) {
        if(isBuySelected) {
          setAmount0(10 ** 12);
          setAmount1(getInputPrice(10 ** 12, currentPair.xch_reserve, currentPair.token_reserve));
        } else {
          setAmount1(1000);
          setAmount0(getInputPrice(1000, currentPair.token_reserve, currentPair.xch_reserve));
        }
      }
   }

    update();

    const interval = setInterval(() => {
      updatePair();
    }, 5000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken, isBuySelected, pair]);

  const setSelectedTokenAndWarn = (t: Token) => {
    if(!t.verified) {
      alert(`WARNING: This token has not been labeled as 'verified' by the TibetSwap team. Please make sure you truly want to transact with asset id 0x${t.asset_id} before proceeding.`);
    }

    setSelectedToken(t);
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
    const price_impact = (y - dy)**2 / y**2 - 1;
    price_impact > -0.05 && setHighPriceImpactConfirmed(false);
    setPriceImpact(price_impact);
  },[amount0, amount1, isBuySelected, pair]);


  const submitSwapOperation = () => {
    const sideOne: [Token, boolean, number][] = [
      [XCH, true, amount0]
    ];
    const sideTwo: [Token, boolean, number][] = [
      [selectedToken!, false, amount1]
    ];

    if(isBuySelected) {
      generateOffer({
        pairId: pair!.launcher_id,
        offer: sideOne,
        request: sideTwo,
        action: ActionType.SWAP
      });
    } else {
      generateOffer({
        pairId: pair!.launcher_id,
        offer: sideTwo,
        request: sideOne,
        action: ActionType.SWAP
      });
    }
  };

  // State management for high price impact banner user confirmation checkbox
  const [highPriceImpactConfirmed, setHighPriceImpactConfirmed] = useState(false);

  return (
    <div className="w-fill">
      <BooleanSwitch
        isSelected={isBuySelected}
        onChange={setIsBuySelected}
        trueLabel='Buy'
        falseLabel='Sell'/>

      <TokenSelector
        selectedToken={selectedToken ?? null}
        tokens={tokens ?? []}
        onChange={setSelectedTokenAndWarn}
        disabled={disabled}/>

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
                setAmount1(getInputPrice(newAmount0, pair?.xch_reserve ?? 0, pair?.token_reserve ?? 0));
              } else {
                setAmount1(getOutputPrice(newAmount0, pair?.token_reserve ?? 0, pair?.xch_reserve ?? 0));
              }
            } else if(amount1 !== newAmount1) {
              setAmount1(newAmount1);

              if(isBuySelected) {
                setAmount0(getOutputPrice(newAmount1, pair?.xch_reserve ?? 0, pair?.token_reserve ?? 0));
              } else {
                setAmount0(getInputPrice(newAmount1, pair?.token_reserve ?? 0, pair?.xch_reserve ?? 0));
              }
            }
        }}
        disabled={selectedToken == null || pair == null}
      />

      {/* Price details Section */}
      { selectedToken !== null && pair !== null && (
        <div className="flex flex-col p-6 rounded-2xl mt-4 text-sm">
          {/* Price */}
          <div className="flex justify-between w-full">
            <p>Price</p>
            <p className="font-medium">1 {selectedToken?.short_name} = {getOutputPrice(1000, pair?.xch_reserve ?? 0, pair?.token_reserve ?? 0)/1000000000000} XCH</p>
          </div>
          {/* Price Impact */}
          <div className="flex justify-between w-full">
            <p>Price impact</p>
            <p className={`font-medium ${priceImpact <= -0.05 ? 'text-red-700' : ''}`}>{(priceImpact * 100).toFixed(2) + '%'}</p>
          </div>
          <p></p>
        </div>
        )
      }

      {/* High price impact warning banner */}
      { priceImpact <= -0.05 && (
      <div className="bg-red-400/50 dark:bg-red-400/20 rounded-xl text-red-700 p-4 flex items-center gap-4">
        <label className="inline-flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="opacity-0 absolute h-0 w-0 peer"
              checked={highPriceImpactConfirmed}
              onChange={() => setHighPriceImpactConfirmed(!highPriceImpactConfirmed)}
            />
            <div className="bg-brandLight dark:bg-zinc-900 rounded-md w-6 h-6 border peer-checked:bg-red-700 border-red-700 flex items-center justify-center">
              {highPriceImpactConfirmed && (
                <svg
                  className="fill-brandLight w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                </svg>
              )}
            </div>
          </div>
        </label>
        <p className="font-medium text-sm">Price impact is very high. You will lose a significant portion of your funds if you proceed. Please tick the box if you would like to continue.</p>
      </div>
      )
    }

      <GenerateOfferButton
        isBuySelected={isBuySelected}
        disabled={selectedToken == null || pair == null || priceImpact <= -0.05 && !highPriceImpactConfirmed}
        onPressed={submitSwapOperation}
      />
    </div>
  );
};

export default Swap;
