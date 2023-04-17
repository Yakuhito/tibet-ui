import { useState, useEffect } from 'react';
import { Token, Pair, getPairByLauncherId, getInputPrice, getOutputPrice, getLiquidityQuote, ActionType } from '../api';
import BooleanSwitch from './BooleanSwitch';
import TokenSelector from './TokenSelector';
import LiquidityInput from './LiquidityInput';
import GenerateOfferButton from './GenerateOfferButton';
import { UNKNWN, XCH, getLiquidityToken } from '@/shared_tokens';
import { GenerateOfferData } from './TabContainer';

type LiquidityProps = {
  disabled: boolean;
  tokens: Token[] | null;
  generateOffer: (data: GenerateOfferData) => void;
};

const Swap: React.FC<LiquidityProps> = ({ disabled, tokens, generateOffer }) => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [pair, setPair] = useState<Pair | null>(null);
  const [isAddSelected, setIsAddSelected] = useState(true);
  const [amount0, setAmount0] = useState(0);
  const [amount1, setAmount1] = useState(0);
  const [amount2, setAmount2] = useState(0);

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

     if(currentPair !== null && currentPair.xch_reserve > 0 && currentPair.token_reserve > 0 && currentPair.liquidity > 1000) {
        setAmount0(getLiquidityQuote(1000, currentPair.liquidity, currentPair.xch_reserve, !isAddSelected));
        setAmount1(getLiquidityQuote(1000, currentPair.liquidity, currentPair.token_reserve, !isAddSelected));
        setAmount2(1000);
      }
   }

    update();

    const interval = setInterval(() => {
      updatePair();
    }, 5000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken, isAddSelected, pair]);

  const setSelectedTokenAndWarn = (t: Token) => {
    if(!t.verified) {
      alert(`WARNING: This token has not been labeled as 'verified' by the TibetSwap team. Please make sure you truly want to transact with asset id 0x${t.asset_id} before proceeding.`);
    }

    setSelectedToken(t);

  }

  const submitLiquidityOperation = () => {
    const sideOne: [Token, boolean, number][] = [
      [XCH, true, amount0],
      [selectedToken!, false, amount1]
    ];
    const sideTwo: [Token, boolean, number][] = [
      [getLiquidityToken(pair!), false, amount2],
    ];

    if(isAddSelected) {
      generateOffer({
        ask: sideOne,
        receive: sideTwo,
        action: ActionType.ADD_LIQUIDITY
      });
    } else {
      generateOffer({
        ask: sideTwo,
        receive: sideOne,
        action: ActionType.REMOVE_LIQUIDITY
      });
    }
  };

  return (
    <div className="w-fill p-2">
      <BooleanSwitch
        isSelected={isAddSelected}
        onChange={setIsAddSelected}
        disabled={disabled}
        trueLabel='Add'
        falseLabel='Remove'/>

      <TokenSelector
        selectedToken={selectedToken ?? null}
        tokens={tokens ?? []}
        onChange={setSelectedTokenAndWarn}
        disabled={disabled}/>

      <LiquidityInput
        token0={XCH}
        token1={selectedToken ?? UNKNWN}
        token2={getLiquidityToken(pair)}
        isAddSelected={isAddSelected}
        onArrowClick={() => setIsAddSelected(!isAddSelected)}
        amount0={amount0}
        amount1={amount1}
        amount2={amount2}
        onAmountsChanged={(newAmount0: number, newAmount1: number, newAmount2: number) => {
            if(amount0 !== newAmount0) {
              setAmount0(newAmount0);
              setAmount1(getLiquidityQuote(newAmount0, pair?.xch_reserve ?? 0, pair?.token_reserve ?? 0, !isAddSelected));
              setAmount2(getLiquidityQuote(newAmount0, pair?.xch_reserve ?? 0, pair?.liquidity ?? 0, isAddSelected));
            } else if(amount1 !== newAmount1) {
                setAmount0(getLiquidityQuote(newAmount1, pair?.token_reserve ?? 0, pair?.xch_reserve ?? 0, !isAddSelected));
                setAmount1(newAmount1);
                setAmount2(getLiquidityQuote(newAmount1, pair?.token_reserve ?? 0, pair?.liquidity ?? 0, isAddSelected));
            } else if(amount2 !== newAmount2) {
                setAmount0(getLiquidityQuote(newAmount2, pair?.liquidity ?? 0, pair?.xch_reserve ?? 0, !isAddSelected));
                setAmount1(getLiquidityQuote(newAmount2, pair?.liquidity ?? 0, pair?.token_reserve ?? 0, !isAddSelected));
                setAmount2(newAmount2);
            }
        }}
        disabled={selectedToken == null || pair == null}
      />

      <GenerateOfferButton
        isBuySelected={isAddSelected}
        disabled={selectedToken == null || pair == null}
        onPressed={submitLiquidityOperation}
      />
    </div>
  );
};

export default Swap;
