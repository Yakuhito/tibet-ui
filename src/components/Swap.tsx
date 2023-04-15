import { useState, useEffect } from 'react';
import { Token, Pair, getPairByLauncherId, getInputPrice, getOutputPrice } from '../api';
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

const UNKNWN: Token = {
  asset_id: '',
  pair_id: '',
  name: 'Unknown Token',
  short_name: '???',
  image_url: 'https://bafybeigzcazxeu7epmm4vtkuadrvysv74lbzzbl2evphtae6k57yhgynp4.ipfs.dweb.link/9098.gif',
  verified: false
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
    async function update() {
      if(selectedToken === null) return;

      var currentPair: Pair | null = pair;
      if(pair === null || selectedToken?.pair_id !== pair.launcher_id) {
        const newPair = await getPairByLauncherId(selectedToken!.pair_id);
        setPair(newPair);
        currentPair = newPair;
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
  }, [selectedToken, isBuySelected, pair]);

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

      <GenerateOfferButton isBuySelected={isBuySelected} disabled={selectedToken == null} onPressed={() => console.log('click!')}/>
    </div>
  );
};

export default Swap;
