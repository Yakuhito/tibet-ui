import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Pair, getAllPairs } from '../api';

import TabContainer, { type SwapUrlPreset } from '@/components/trade_components/TabContainer';
import { useAppDispatch } from '@/hooks';
import { getPairs } from '@/redux/globalOnLoadDataSlice';

const PairPreSelect: React.FC = () => {
  
  // Get pair short name from url
  const router = useRouter();
  const { pair_short_name, amountIn, amountOut, xchIsInput } = router.query;

  const dispatch = useAppDispatch();
  dispatch(getPairs())
  
  const [selectedPair, setSelectedPair] = useState<Pair | null>(null);
  const [swapUrlPreset, setSwapUrlPreset] = useState<SwapUrlPreset | null>(null);

  // Fetch all pairs
  const [pairs, setPairs] = useState<Pair[] | null>(null);
  useEffect(() => {
    async function fetchPairs() {
      const allPairs = await getAllPairs();
      setPairs(allPairs);
    }
    fetchPairs();
  }, []);

  // Pre-select asset on page load
  useEffect(() => {
    const normalizeQueryValue = (value: string | string[] | undefined): string => {
      if (Array.isArray(value)) {
        return value[0] ?? '';
      }
      return value ?? '';
    };

    const isValidAmount = (value: string): boolean => /^\d*\.?\d+$/.test(value);
    const decimalCount = (value: string): number => {
      const [, decimals = ''] = value.split('.');
      return decimals.length;
    };

    const amountInValue = normalizeQueryValue(amountIn).trim();
    const amountOutValue = normalizeQueryValue(amountOut).trim();
    const xchIsInputValue = normalizeQueryValue(xchIsInput).trim();
    const isXchInput = xchIsInputValue !== 'false';

    const selectedAmountType = amountInValue !== '' ? 'in' : amountOutValue !== '' ? 'out' : null;
    const selectedAmount = selectedAmountType === 'in' ? amountInValue : amountOutValue;

    if (selectedAmountType === null || selectedAmount === '') {
      setSwapUrlPreset(null);
      return;
    }

    if (!isValidAmount(selectedAmount)) {
      setSwapUrlPreset(null);
      return;
    }

    const maxDecimals = isXchInput
      ? (selectedAmountType === 'in' ? 12 : 3)
      : (selectedAmountType === 'in' ? 3 : 12);
    if (decimalCount(selectedAmount) > maxDecimals) {
      setSwapUrlPreset(null);
      return;
    }

    setSwapUrlPreset({
      amountType: selectedAmountType,
      amount: selectedAmount,
      xchIsInput: isXchInput
    });
  }, [amountIn, amountOut, xchIsInput]);

  useEffect(() => {
    const getPairFromShortName = (short_name: string | string[] | undefined) => {
      if (!pairs) return
      const pair = pairs.filter(pair => (
        short_name === pair.asset_short_name
      ))
      if (!pair) return null
      return pair[0]
    }

    if (!pair_short_name && !pairs) return
    const pair = getPairFromShortName(pair_short_name)
    if (!pair) return
    setSelectedPair(pair);
  }, [pair_short_name, pairs])

  return (
    <main className="max-w-[28rem] mx-auto">
      <TabContainer pairs={pairs} selectedPair={selectedPair} setSelectedPair={setSelectedPair} swapUrlPreset={swapUrlPreset} />
    </main>
  );
};

export default PairPreSelect;
