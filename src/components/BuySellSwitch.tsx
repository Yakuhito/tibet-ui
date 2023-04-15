import { useState } from 'react';

type BuySellSwitchProps = {
  disabled: boolean;
  isBuySelected: boolean;
  onChange: (isBuying: boolean) => void;
};

const BuySellSwitch: React.FC<BuySellSwitchProps> = ({ disabled, onChange, isBuySelected }) => {
  return (
    <div className="">
        <div className="flex items-center justify-center">
          <button
            onClick={() => onChange(true)}
            disabled={disabled}
            className={`${
              disabled ?
                'bg-gray-200 cursor-not-allowed' :
              isBuySelected
                ? 'bg-green-500 border-green-500 text-white'
                : 'bg-white border-gray-300 text-black'
            } px-4 py-2 rounded-l-md focus:outline-none w-full border`}
          >
            Buy
          </button>
          <button
            onClick={() => onChange(false)}
            disabled={disabled}
            className={`${
              disabled ?
                'bg-gray-200 cursor-not-allowed' :
              isBuySelected
                ? 'bg-white border-gray-300 text-black'
                : 'bg-red-500 border-red-500 text-white'
            } px-4 py-2 rounded-r-md focus:outline-none w-full border`}
          >
            Sell
          </button>
        </div>
      </div>
  );
};

export default BuySellSwitch;
