import { useState, useEffect } from 'react';
import { Token, Pair, getPairByLauncherId } from '../api';
import BuySellSwitch from './BuySellSwitch';
import TokenSelector from './TokenSelector';
import SwapInput from './SwapInput';
import GenerateOfferButton from './GenerateOfferButton';

const XCH: Token = {
    asset_id: '',
    pair_id: '',
    name: 'Chia',
    short_name: 'XCH',
    image_url: '/assets/xch.webp',
    verified: true
}

type SwapProps = {
  disabled: boolean;
  tokens: Token[] | null;
};

const Swap: React.FC<SwapProps> = ({ disabled, tokens }) => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [pair, setPair] = useState<Pair | null>(null);
  const [isBuySelected, setIsBuySelected] = useState(true);
  const [amount0, setAmount0] = useState(0);
  const [amount1, setAmount1] = useState(0);

  useEffect(() => {
    async function fetchPair() {
      setPair(null);

      if(selectedToken == null) return;

      const pair = await getPairByLauncherId(selectedToken.pair_id);
      setPair(pair);
    }

    fetchPair();
  }, [selectedToken]);

  return (
    <div className="w-fill p-2">
      <BuySellSwitch
        isBuySelected={isBuySelected}
        onChange={setIsBuySelected}
        disabled={disabled} />

      <TokenSelector
        selectedToken={selectedToken ?? null}
        tokens={tokens ?? []}
        onChange={setSelectedToken}
        disabled={disabled}/>

      <SwapInput
        token0={XCH}
        token1={selectedToken ?? XCH}
        isBuySelected={isBuySelected}
        onArrowClick={() => setIsBuySelected(!isBuySelected)}
        amount0={amount0}
        amount1={amount1}
        onAmountsChanged={(amount0, amount1: number) => {
            setAmount0(amount0);
            setAmount1(amount1);
        }}
        disabled={selectedToken == null || pair == null}
      />

      <GenerateOfferButton isBuySelected={isBuySelected} disabled={selectedToken == null} onPressed={() => console.log('click!')}/>
    </div>
  );
};

export default Swap;
