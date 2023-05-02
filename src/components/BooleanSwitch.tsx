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
        <div className="flex items-center justify-center bg-brandDark/10 p-1 rounded-xl font-medium mb-4">
          <button
            onClick={() => onChange(true)}
            disabled={disabled}
            className={`${
              disabled ?
                'bg-gray-200 cursor-not-allowed' :
              isSelected
                ? 'bg-green-800 text-white'
                : 'text-brandDark'
            } px-4 py-2 rounded-lg focus:outline-none w-full`}
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
                ? 'text-brandDark'
                : 'bg-red-700 text-white'
            } px-4 py-2 rounded-lg focus:outline-none w-full`}
          >
            {falseLabel}
          </button>
        </div>
      </div>
  );
};

export default BooleanSwitch;
