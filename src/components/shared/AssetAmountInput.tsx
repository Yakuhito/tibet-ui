import { type ChangeEvent, useState } from 'react';

import type { Pair, Token } from '../../api';

import TokenSelector from './TokenSelector';

type AssetAmountInputProps = {
  token: Token;
  value: number;
  onChange: (value: number) => void;
  maxDecimals: number;
  disabled?: boolean;
  selectPair: (pair: Pair) => void;
};

const AssetAmountInput: React.FC<AssetAmountInputProps> = ({ token, onChange, maxDecimals, disabled, value, selectPair }) => {

  const [inputValue, setInputValue] = useState<number | string>("");

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(target.value);
    if(Number.isNaN(parsed)) {
      onChange(0);
      setInputValue("")
    } else {
      onChange(Math.floor(parsed * Math.pow(10, maxDecimals)));
      setInputValue(target.value)
    }
  }

  return (
    <div className={`flex justify-between items-center bg-brandDark/10 p-6 rounded-xl relative ${disabled ? 'bg-opacity-30' : ''}`}>

        <input
          className={`w-full text-4xl font-bold px-2 focus:outline-none bg-transparent leading-normal ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-30': ''}`}
          value={value != 0 ? value / Math.pow(10, maxDecimals) : inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          inputMode="decimal"
          pattern="[0-9]*"
          placeholder="0"
          type="number"
          min={0}
        />

        <TokenSelector selectedToken={token} selectPair={selectPair} disabled={disabled} />

    </div>
  );
};

export default AssetAmountInput;