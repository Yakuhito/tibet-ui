import { type ChangeEvent, useState } from 'react';

import type { Token } from '../../api';

import TokenSelector from './TokenSelector';

type AssetAmountInputProps = {
  token: Token;
  value: number;
  onChange: (value: number) => void;
  maxDecimals: number;
  disabled?: boolean;
  selectToken: (token: Token) => void;
};

const AssetAmountInput: React.FC<AssetAmountInputProps> = ({ token, onChange, maxDecimals, disabled, value, selectToken }) => {

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

        <TokenSelector selectedToken={token} selectToken={selectToken} disabled={disabled} />

    </div>
  );
};

export default AssetAmountInput;