import { useState, useEffect } from 'react';

type HexInputProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  helperText?: string;
  small?: boolean;
  expectedLength: number;
};

const HexInput: React.FC<HexInputProps> = ({ value, onChange, label, helperText, small, expectedLength }) => {
  const [inputValue, setInputValue] = useState<string>(value);

  // Sync internal state with external value prop
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const isValidHex = (val: string): boolean => {
    return /^[0-9a-fA-F]*$/.test(val);
  };

  const isCorrectLength = inputValue.length === expectedLength;
  const isValidInput = isValidHex(inputValue);

  return (
    <div className={`bg-brandDark/10 p-2 rounded-xl border-2`}>
      <label className="text-sm font-medium px-2 focus:outline-none bg-transparent leading-normal">{label}</label>
      <div className="p-2">
        <input
          className={`w-full ${small ? 'text-sm' : 'text-xl'} font-bold px-2 focus:outline-none bg-transparent leading-normal font-mono`}
          value={inputValue}
          onChange={(e) => {
            const newValue = e.target.value;
            if (isValidHex(newValue) && newValue.length <= expectedLength) {
              onChange(newValue);
              setInputValue(newValue);
            }
          }}
          placeholder={helperText}
          maxLength={expectedLength}
        />
        <div className="text-xs text-gray-500 mt-1 px-2">
          {inputValue.length}/{expectedLength} characters
          {inputValue !== '' && !isValidInput && <span className="text-red-500 ml-2">Invalid hex characters</span>}
          {inputValue !== '' && isValidInput && !isCorrectLength && <span className="text-yellow-600 ml-2">Must be exactly {expectedLength} characters</span>}
          {inputValue !== '' && isValidInput && isCorrectLength && <span className="text-green-600 ml-2">Valid</span>}
        </div>
      </div>
    </div>
  );
};

export default HexInput; 