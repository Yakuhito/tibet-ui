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
  onPairSelect: (pairLauncherId: string | null) => void;
};

const Swap: React.FC<SwapProps> = ({ disabled, tokens, generateOffer, onPairSelect }) => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
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
          onPairSelect(newPair.launcher_id);
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

  return (
    <div className="w-fill">
      <BooleanSwitch
        isSelected={isBuySelected}
        onChange={setIsBuySelected}
        disabled={disabled}
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

      <GenerateOfferButton
        isBuySelected={isBuySelected}
        disabled={selectedToken == null || pair == null}
        onPressed={submitSwapOperation}
      />
    </div>
  );
};

export default Swap;
