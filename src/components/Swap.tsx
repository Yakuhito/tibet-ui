import { Token, Pair, getPairByLauncherId, getInputPrice, getOutputPrice, ActionType } from '../api';
import GenerateOfferButton from './GenerateOfferButton';
import { GenerateOfferData } from './TabContainer';
import { UNKNWN, XCH } from '@/shared_tokens';
import { useState, useEffect } from 'react';
import TokenSelector from './TokenSelector';
import BooleanSwitch from './BooleanSwitch';
import DevFeeModal from './modals/DevFeeModal';
import SwapInput from './SwapInput';

type SwapProps = {
  disabled: boolean;
  tokens: Token[] | null;
  generateOffer: (data: GenerateOfferData) => void;
  selectedToken: Token | null;
  setSelectedToken: React.Dispatch<React.SetStateAction<Token | null>>;
  devFee: number;
  setDevFee: (value: number) => void;
};

const Swap: React.FC<SwapProps> = ({ disabled, tokens, generateOffer, selectedToken, setSelectedToken, devFee, setDevFee }) => {
  const [pair, setPair] = useState<Pair | null>(null);
  const [isBuySelected, setIsBuySelected] = useState(true);
  const [amount0, setAmount0] = useState(0);
  const [amount1, setAmount1] = useState(0);

  // Update token pair details every 5 seconds
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
    const price_impact = -((y - dy)**2 / y**2 - 1);
    price_impact < 0.1 && setHighPriceImpactConfirmed(false);
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

  const [isDevFeeModalOpen, setIsDevFeeModalOpen] = useState(false)

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

      {/* High price impact warning banner */}
      { priceImpact >= 0.1 && (
      <div className="bg-red-400/50 dark:bg-red-400/20 rounded-xl text-red-700 dark:text-red-600 p-4 mt-8 flex items-center gap-4">
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
        <div className="flex flex-col p-6 rounded-2xl mt-2 gap-1 bg-brandDark/0 text-sm">
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
            <p className="font-medium">0.70%</p>
          </div>

          {/* Dev Fee */}
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-1">
              <p>Dev fee</p>
              <svg onClick={() => setIsDevFeeModalOpen(true)} className="w-4 hover:rotate-45 transition cursor-pointer dark:fill-brandLight" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M 24 4 C 22.423103 4 20.902664 4.1994284 19.451172 4.5371094 A 1.50015 1.50015 0 0 0 18.300781 5.8359375 L 17.982422 8.7382812 C 17.878304 9.6893592 17.328913 10.530853 16.5 11.009766 C 15.672739 11.487724 14.66862 11.540667 13.792969 11.15625 L 13.791016 11.15625 L 11.125 9.9824219 A 1.50015 1.50015 0 0 0 9.4257812 10.330078 C 7.3532865 12.539588 5.7626807 15.215064 4.859375 18.201172 A 1.50015 1.50015 0 0 0 5.4082031 19.845703 L 7.7734375 21.580078 C 8.5457929 22.147918 9 23.042801 9 24 C 9 24.95771 8.5458041 25.853342 7.7734375 26.419922 L 5.4082031 28.152344 A 1.50015 1.50015 0 0 0 4.859375 29.796875 C 5.7625845 32.782665 7.3519262 35.460112 9.4257812 37.669922 A 1.50015 1.50015 0 0 0 11.125 38.015625 L 13.791016 36.841797 C 14.667094 36.456509 15.672169 36.511947 16.5 36.990234 C 17.328913 37.469147 17.878304 38.310641 17.982422 39.261719 L 18.300781 42.164062 A 1.50015 1.50015 0 0 0 19.449219 43.460938 C 20.901371 43.799844 22.423103 44 24 44 C 25.576897 44 27.097336 43.800572 28.548828 43.462891 A 1.50015 1.50015 0 0 0 29.699219 42.164062 L 30.017578 39.261719 C 30.121696 38.310641 30.671087 37.469147 31.5 36.990234 C 32.327261 36.512276 33.33138 36.45738 34.207031 36.841797 L 36.875 38.015625 A 1.50015 1.50015 0 0 0 38.574219 37.669922 C 40.646713 35.460412 42.237319 32.782983 43.140625 29.796875 A 1.50015 1.50015 0 0 0 42.591797 28.152344 L 40.226562 26.419922 C 39.454197 25.853342 39 24.95771 39 24 C 39 23.04229 39.454197 22.146658 40.226562 21.580078 L 42.591797 19.847656 A 1.50015 1.50015 0 0 0 43.140625 18.203125 C 42.237319 15.217017 40.646713 12.539588 38.574219 10.330078 A 1.50015 1.50015 0 0 0 36.875 9.984375 L 34.207031 11.158203 C 33.33138 11.54262 32.327261 11.487724 31.5 11.009766 C 30.671087 10.530853 30.121696 9.6893592 30.017578 8.7382812 L 29.699219 5.8359375 A 1.50015 1.50015 0 0 0 28.550781 4.5390625 C 27.098629 4.2001555 25.576897 4 24 4 z M 24 7 C 24.974302 7 25.90992 7.1748796 26.847656 7.3398438 L 27.035156 9.0644531 C 27.243038 10.963375 28.346913 12.652335 30 13.607422 C 31.654169 14.563134 33.668094 14.673009 35.416016 13.904297 L 37.001953 13.207031 C 38.219788 14.669402 39.183985 16.321182 39.857422 18.130859 L 38.451172 19.162109 C 36.911538 20.291529 36 22.08971 36 24 C 36 25.91029 36.911538 27.708471 38.451172 28.837891 L 39.857422 29.869141 C 39.183985 31.678818 38.219788 33.330598 37.001953 34.792969 L 35.416016 34.095703 C 33.668094 33.326991 31.654169 33.436866 30 34.392578 C 28.346913 35.347665 27.243038 37.036625 27.035156 38.935547 L 26.847656 40.660156 C 25.910002 40.82466 24.973817 41 24 41 C 23.025698 41 22.09008 40.82512 21.152344 40.660156 L 20.964844 38.935547 C 20.756962 37.036625 19.653087 35.347665 18 34.392578 C 16.345831 33.436866 14.331906 33.326991 12.583984 34.095703 L 10.998047 34.792969 C 9.7799772 33.330806 8.8159425 31.678964 8.1425781 29.869141 L 9.5488281 28.837891 C 11.088462 27.708471 12 25.91029 12 24 C 12 22.08971 11.087719 20.290363 9.5488281 19.160156 L 8.1425781 18.128906 C 8.8163325 16.318532 9.7814501 14.667839 11 13.205078 L 12.583984 13.902344 C 14.331906 14.671056 16.345831 14.563134 18 13.607422 C 19.653087 12.652335 20.756962 10.963375 20.964844 9.0644531 L 21.152344 7.3398438 C 22.089998 7.1753403 23.026183 7 24 7 z M 24 16 C 19.599487 16 16 19.59949 16 24 C 16 28.40051 19.599487 32 24 32 C 28.400513 32 32 28.40051 32 24 C 32 19.59949 28.400513 16 24 16 z M 24 19 C 26.779194 19 29 21.220808 29 24 C 29 26.779192 26.779194 29 24 29 C 21.220806 29 19 26.779192 19 24 C 19 21.220808 21.220806 19 24 19 z"/></svg>
            </div>
            <p className="font-medium">{(devFee * 100).toFixed(2) + '%'}</p>
          </div>
          <DevFeeModal isOpen={isDevFeeModalOpen} setIsOpen={setIsDevFeeModalOpen} setDevFee={setDevFee} devFee={devFee} />
          
        </div>
        )
      }
    </div>
  );
};

export default Swap;
