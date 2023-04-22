import { Token } from '../api';
import AssetAmountInput from './AssetAmountInput';

type LiquidityInputsProps = {
  token0: Token;
  token1: Token;
  token2: Token;
  isAddSelected: boolean;
  onArrowClick: () => void;
  amount0: number;
  amount1: number;
  amount2: number;
  onAmountsChanged: (amount0: number, amount1: number, amount2: number) => void;
  disabled: boolean;
};

const LiquidityInput: React.FC<LiquidityInputsProps> = ({
  token0,
  token1,
  token2,
  isAddSelected,
  amount0,
  amount1,
  amount2,
  onAmountsChanged,
  onArrowClick,
  disabled
}) => {
  return (
    <div className="w-fill mt-8">
      <AssetAmountInput
        token={token0}
        value={amount0}
        onChange={(val) => onAmountsChanged(val, amount1, amount2)}
        maxDecimals={12}
        disabled={true}
      />
      <div className='mt-2'>
        <AssetAmountInput
          token={token1}
          value={amount1}
          onChange={(val) => onAmountsChanged(amount0, val, amount2)}
          maxDecimals={3}
          disabled={disabled || !isAddSelected}
        />
      </div>
      <div className="p-1 items-center justify-center flex w-fill"
        onClick={disabled ? () => {} : onArrowClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-7 w-7 ${
            disabled ? 'text-gray-300 cursor-not-allowed' :
            (isAddSelected ? 'text-green-500' : 'text-red-500')
          } ${
            isAddSelected ? '' : 'transform rotate-180'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <AssetAmountInput
        token={token2}
        value={amount2}
        onChange={(val) => onAmountsChanged(amount0, amount1, val)}
        maxDecimals={3}
        disabled={disabled || isAddSelected}
      />
    </div>
  );
};

export default LiquidityInput;
