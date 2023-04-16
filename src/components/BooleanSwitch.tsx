import { useState } from 'react';

type BooleanSwitchProps = {
  disabled: boolean;
  isSelected: boolean;
  onChange: (isSelected: boolean) => void;
  trueLabel: string;
  falseLabel: string;
};

const BooleanSwitch: React.FC<BooleanSwitchProps> = ({ disabled, onChange, isSelected, trueLabel, falseLabel }) => {
  return (
    <div className="">
        <div className="flex items-center justify-center">
          <button
            onClick={() => onChange(true)}
            disabled={disabled}
            className={`${
              disabled ?
                'bg-gray-200 cursor-not-allowed' :
              isSelected
                ? 'bg-green-500 border-green-500 text-white'
                : 'bg-white border-gray-300 text-black'
            } px-4 py-2 rounded-l-md focus:outline-none w-full border`}
          >
            {trueLabel}
          </button>
          <button
            onClick={() => onChange(false)}
            disabled={disabled}
            className={`${
              disabled ?
                'bg-gray-200 cursor-not-allowed' :
              isSelected
                ? 'bg-white border-gray-300 text-black'
                : 'bg-red-500 border-red-500 text-white'
            } px-4 py-2 rounded-r-md focus:outline-none w-full border`}
          >
            {falseLabel}
          </button>
        </div>
      </div>
  );
};

export default BooleanSwitch;
