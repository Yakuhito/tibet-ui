import Image from 'next/image';
import { useState } from 'react';
import { Token } from '../api';

type AssetAmountInputProps = {
  token: Token;
  value: number;
  onChange: (value: number) => void;
  maxDecimals: number;
  disabled?: boolean;
};

const AssetAmountInput: React.FC<AssetAmountInputProps> = ({ token, onChange, maxDecimals, disabled, value }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    const newValueWithMaxDecimals = Number(newValue.toFixed(maxDecimals));
    onChange(newValueWithMaxDecimals * Math.pow(10, maxDecimals));
  };

  return (
    <div className="flex justify-between">
      <div className="flex-grow">
        <input
          className={`w-full text-right py-2 px-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500 ${
            disabled ? 'bg-gray-100 cursor-not-allowed': ''
          }`}
          type="number"
          min={0}
          placeholder="133.7"
          value={value / Math.pow(10, maxDecimals)}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      <div className={`flex-shrink-0 flex items-center border rounded-r-md p-2 ${
        disabled ? 'bg-gray-100 cursor-not-allowed': ''
      }`}>
        <Image className="mr-1" width={24} height={24} src={token.image_url ?? '/logo.jpg'} alt={token.name} />
        <span>{token.short_name}</span>
      </div>
    </div>
  );
};

export default AssetAmountInput;
