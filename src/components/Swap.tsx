import { useState } from 'react';
import { Token } from '../api';
import BuySellSwitch from './BuySellSwitch';
import TokenSelector from './TokenSelector';
import SwapInput from './SwapInput';
import GenerateOfferButton from './GenerateOfferButton';

const XCH: Token = {
    asset_id: '',
    pair_id: '',
    name: 'Chia',
    short_name: 'XCH',
    image_url: '/xch.webp',
    verified: true
}

const Swap: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isBuySelected, setIsBuySelected] = useState(true);
  const [amount0, setAmount0] = useState(0);
  const [amount1, setAmount1] = useState(0);

  const handleGenerateOffer = () => {
    console.log('Selected token:', selectedToken);
    console.log('Action:', isBuySelected ? 'Buy' : 'Sell');
  };

  return (
    <div className="w-fill p-2">
      <BuySellSwitch
        isBuySelected={isBuySelected}
        onChange={setIsBuySelected}
        disabled={true} />

      <TokenSelector
        selectedToken={selectedToken ?? XCH}
        tokens={[]}
        onChange={setSelectedToken}
        disabled={true}/>

      <SwapInput
        token0={XCH}
        token1={XCH}
        isBuySelected={isBuySelected}
        onArrowClick={() => setIsBuySelected(!isBuySelected)}
        amount0={amount0}
        amount1={amount1}
        onAmountsChanged={(amount0, amount1: number) => {
            setAmount0(amount0);
            setAmount1(amount1);
        }}
        disabled={true}
      />

      <GenerateOfferButton isBuySelected={isBuySelected} disabled={true} onPressed={handleGenerateOffer}/>
    </div>
  );
};

export default Swap;
