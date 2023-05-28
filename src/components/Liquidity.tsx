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
  selectedToken: Token | null;
  setSelectedToken: React.Dispatch<React.SetStateAction<Token | null>>;
};

const Liquidity: React.FC<LiquidityProps> = ({ disabled, tokens, generateOffer, selectedToken, setSelectedToken }) => {
  const emergency_withdraw = process.env.NEXT_PUBLIC_V1_EMERGENCY_WITHDRAW === "true";

  const [pair, setPair] = useState<Pair | null>(null);
  const [isAddSelected, setIsAddSelected] = useState(emergency_withdraw ? false : true);
  const [amount0, setAmount0] = useState(0);
  const [amount1, setAmount1] = useState(0);
  const [amount2, setAmount2] = useState(0);

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

     if(currentPair !== null && currentPair.xch_reserve > 0 && currentPair.token_reserve > 0 && currentPair.liquidity > 1000) {
        if(isAddSelected) {
          const liquidity = getLiquidityQuote(1000, currentPair.token_reserve, currentPair.liquidity, false);
        
          var xchAmount = getLiquidityQuote(1000, currentPair.token_reserve, currentPair.xch_reserve, false);
          xchAmount += liquidity;
      
          setAmount0(xchAmount);
          setAmount1(1000);
          setAmount2(liquidity);
        } else {
          const tokenAmount = getLiquidityQuote(1000, currentPair.liquidity, currentPair.token_reserve, true);
          var xchAmount = getLiquidityQuote(1000, currentPair.liquidity, currentPair.xch_reserve, true);
          xchAmount += 1000;

          setAmount0(xchAmount);
          setAmount1(tokenAmount);
          setAmount2(1000);
        }
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
      [getLiquidityToken(pair!, selectedToken), false, amount2],
    ];

    if(isAddSelected) {
      generateOffer({
        pairId: pair!.launcher_id,
        offer: sideOne,
        request: sideTwo,
        action: ActionType.ADD_LIQUIDITY
      });
    } else {
      generateOffer({
        pairId: pair!.launcher_id,
        offer: sideTwo,
        request: sideOne,
        action: ActionType.REMOVE_LIQUIDITY
      });
    }
  };

  return (
    <div className="w-fill">

      {/* Risk notice */}
      <div className="bg-orange-400/50 dark:bg-orange-400/20 rounded-xl text-orange-700 p-4 mt-8 flex items-center gap-4 mb-4 font-medium text-sm animate-fadeIn">
        <p>Providing liquidity carries associated risks, such as impermanent loss and the possibility of security vulnerabilities. Please take time to do your own research before adding assets to the protocol.</p>
      </div>
      
      <BooleanSwitch
        isSelected={isAddSelected}
        onChange={ emergency_withdraw ? () => {} : setIsAddSelected }
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
        token2={getLiquidityToken(pair, selectedToken)}
        isAddSelected={isAddSelected}
        onArrowClick={emergency_withdraw ? () => {} : () => setIsAddSelected(!isAddSelected)}
        amount0={amount0}
        amount1={amount1}
        amount2={amount2}
        onAmountsChanged={(newAmount0: number, newAmount1: number, newAmount2: number) => {
            var tokenAmount = 0;
            var liquidity = 0;
            var xchAmount = 0;
            
            if(isAddSelected) {
              tokenAmount = newAmount1;
              liquidity = getLiquidityQuote(tokenAmount, pair?.token_reserve ?? 0, pair?.liquidity ?? 0, false);
              xchAmount = getLiquidityQuote(tokenAmount, pair?.token_reserve ?? 0, pair?.xch_reserve ?? 0, false);
              xchAmount += liquidity; // ask for user to offer more XCH (to mint tokens)
            } else {
              liquidity = newAmount2;
              tokenAmount = getLiquidityQuote(liquidity, pair?.liquidity ?? 0, pair?.token_reserve ?? 0, true);
              xchAmount = getLiquidityQuote(liquidity, pair?.liquidity ?? 0, pair?.xch_reserve ?? 0, true);
              xchAmount += liquidity; // tell user to request more XCH (from liq. burn)
            }
            
            setAmount0(xchAmount);
            setAmount1(tokenAmount);
            setAmount2(liquidity);
        }}
        disabled={selectedToken == null || pair == null}
      />

      <GenerateOfferButton
        isBuySelected={isAddSelected}
        disabled={selectedToken == null || pair == null || amount0 === 0}
        onPressed={submitLiquidityOperation}
        text={(isAddSelected ? 'Add' : 'Remove') + ' Liquidity'}
      />

      {pair && (
      <div className="flex flex-col p-6 rounded-2xl mt-2 gap-1 bg-brandDark/0 text-sm">
        {/* Price */}
        <div className="flex justify-between w-full">
          <p>Price</p>
          <p className="font-medium">1 {selectedToken?.short_name} = {((pair.xch_reserve/1000000000000) / (pair.token_reserve/1000)).toFixed(10)} {process.env.NEXT_PUBLIC_XCH}</p>
        </div>

        {/* Token Reserve */}
        <div className="flex justify-between w-full">
          <p>Token reserve</p>
          <p className="font-medium">{(pair.token_reserve/1000).toFixed(3)} {selectedToken?.short_name}</p>
        </div>

        {/* XCH Reserve */}
        <div className="flex justify-between w-full">
          <p>{process.env.NEXT_PUBLIC_XCH} reserve</p>
          <p className="font-medium">{(pair.xch_reserve/1000000000000).toFixed(3)} {process.env.NEXT_PUBLIC_XCH}</p>
        </div>

      </div>
      )}

    </div>
  );
};

export default Liquidity;
