import Image from 'next/image';
import { Token } from '../api';

type AssetAmountInputProps = {
  token: Token;
  value: number;
  onChange: (value: number) => void;
  maxDecimals: number;
  disabled?: boolean;
};

const AssetAmountInput: React.FC<AssetAmountInputProps> = ({ token, onChange, maxDecimals, disabled, value }) => {
  return (
    <div className={`flex justify-between bg-brandDark/10 p-6 rounded-2xl ${disabled ? 'opacity-30' : ''}`}>

      {/* Currency Label */}
      <div className={`absolute ${disabled ? 'cursor-not-allowed': ''}`}>
        <div className="flex justify-center items-center  rounded-full py-1 font-bold px-0">
          <Image className="mr-1 rounded-full" width={24} height={24} src={token.image_url ?? '/logo.jpg'} alt={token.name} />
          <span>{token.short_name}</span>
        </div>
      </div>

      <div className="flex-grow">
        <input
          className={`w-full text-4xl font-bold px-2 focus:outline-none pt-12 bg-transparent ${
            disabled ? 'bg-gray-100 cursor-not-allowed': ''
          }`}
          type="number"
          min={0}
          placeholder="133.7"
          value={value / Math.pow(10, maxDecimals)}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            if(Number.isNaN(parsed)) {
              onChange(0);
            } else {
              onChange(Math.floor(parsed * Math.pow(10, maxDecimals)));
            }
          }}
          disabled={disabled}
        />
      </div>

    </div>
  );
};

export default AssetAmountInput;
