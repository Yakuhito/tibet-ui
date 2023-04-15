import { Token } from '../api';
import AssetAmountInput from './AssetAmountInput';

type SwapInputsProps = {
  token0: Token;
  token1: Token;
  isBuySelected: boolean;
  onArrowClick: () => void;
  amount0: number;
  amount1: number;
  onAmountsChanged: (amount0: number, amount1: number) => void;
  disabled: boolean;
};

const SwapInputs: React.FC<SwapInputsProps> = ({
  token0,
  token1,
  isBuySelected,
  amount0,
  amount1,
  onAmountsChanged,
  onArrowClick,
  disabled
}) => {
  return (
    <div className="w-fill mt-8">
      <AssetAmountInput
        token={token0}
        value={amount0}
        onChange={(val) => onAmountsChanged(val, amount1)}
        maxDecimals={12}
        disabled={disabled}
      />
      <div className="p-1 items-center justify-center flex w-fill"
        onClick={disabled ? () => {} : onArrowClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-7 w-7 ${
            disabled ? 'text-gray-300 cursor-not-allowed' :
            (isBuySelected ? 'text-green-500' : 'text-red-500 transform rotate-180')
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <AssetAmountInput
        token={token1}
        value={amount1}
        onChange={(val) => onAmountsChanged(amount0, val)}
        maxDecimals={4}
        disabled={disabled}
      />
    </div>
  );
};

export default SwapInputs;
