import { type ChangeEvent, useState, useEffect } from 'react';

type GeneralInputProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  helperText?: string;
  small?: boolean;
  type?: 'text' | 'decimal';
};

const GeneralInput: React.FC<GeneralInputProps> = ({ value, onChange, label, helperText, small, type = 'decimal' }) => {

  const [inputValue, setInputValue] = useState<string>(value);

  // Sync internal state with external value prop
  useEffect(() => {
    setInputValue(value);
  }, [value]);

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
            inputMode={type === 'decimal' ? 'decimal' : 'text'}
            pattern={type === 'decimal' ? '[0-9]*' : undefined}
            placeholder={helperText}
          />
        </div>
    </div>
    );
};

export default GeneralInput;