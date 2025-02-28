import { type ChangeEvent, useState } from 'react';

type GeneralInputProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  helperText?: string;
  small?: boolean;
};

const GeneralInput: React.FC<GeneralInputProps> = ({ value, onChange, label, helperText, small }) => {

  const [inputValue, setInputValue] = useState<string>(value);

  return (
    <div className="bg-brandDark/10 p-2 rounded-xl">
        <label className="text-sm font-medium px-2 focus:outline-none bg-transparent leading-normal">{label}</label>
        <div className="p-2">
          <input
            className={`w-full ${small ? 'text-sm' : 'text-xl'} font-bold px-2 focus:outline-none bg-transparent leading-normal`}
            value={inputValue}
            onChange={(a) => {
              onChange(a.target.value);
              setInputValue(a.target.value);
            }}
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder={helperText}
          />
        </div>
    </div>
    );
};

export default GeneralInput;