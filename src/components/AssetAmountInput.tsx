import type { ChangeEvent } from 'react';
import type { Token } from '../api';
import { useState } from 'react';
import Image from 'next/image';

type AssetAmountInputProps = {
  token: Token;
  value: number;
  onChange: (value: number) => void;
  maxDecimals: number;
  disabled?: boolean;
};

const AssetAmountInput: React.FC<AssetAmountInputProps> = ({ token, onChange, maxDecimals, disabled, value }) => {

  const [inputValue, setInputValue] = useState<number | string>("");

  // const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
  //   const parsed = target.value != "" ? Number(target.value) : 0;
  //   console.log(parsed)
  //   if (target.value == "") {
  //     setInputValue("")
  //     onChange(0)
  //   } else {
  //     onChange(Math.floor(0 * Math.pow(10, maxDecimals)));
  //     setInputValue(target.value)
  //   }

  //   console.log(inputValue !== "" && value !== 0, inputValue, value)
  // }

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
    <div className={`flex justify-between bg-brandDark/10 p-6 rounded-2xl relative pt-[59px] ${disabled ? 'opacity-30' : ''}`}>

      {/* Token Short_Name */}
      <div className={`absolute top-6 ${disabled ? 'cursor-not-allowed': ''}`}>
        <div className="flex justify-center items-center  rounded-full py-1 font-bold">
          <Image className="mr-1 rounded-full animate-fadeIn" width={24} height={24} src={token.image_url ?? '/logo.jpg'} alt={token.name} />
          <span>{token.short_name}</span>
        </div>
      </div>

      {/* Input/Value */}
      <input
        className={`w-full text-4xl font-bold px-2 focus:outline-none bg-transparent leading-normal ${disabled ? 'bg-gray-100 cursor-not-allowed': ''}`}
        // value={value / Math.pow(10, maxDecimals)}
        value={value != 0 ? value / Math.pow(10, maxDecimals) : inputValue}
        onChange={handleInputChange}
        disabled={disabled}
        inputMode="decimal"
        pattern="[0-9]*"
        placeholder="0"
        type="number"
        min={0}
      />

    </div>
  );
};

export default AssetAmountInput;