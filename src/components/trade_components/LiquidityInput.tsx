import type { Pair, Token } from "../../api";

import ChevronDownIcon from "@/components/shared/icons/ChevronDownIcon";
import AssetAmountInput from "@/components/shared/AssetAmountInput";

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
  selectPair: (pair: Pair) => void;
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
  disabled,
  selectPair,
}) => {
  return (
    <div className="w-fill mt-8">

      <div className={`transition-transform duration-300 ease-in-out ${isAddSelected ? 'translate-y-0' : 'translate-y-[calc(200%+1rem)]'}`}>
        <AssetAmountInput
          token={token0}
          value={amount0}
          onChange={(val) => onAmountsChanged(val, amount1, amount2)}
          maxDecimals={12}
          disabled={true}
          selectPair={selectPair}
        />
      </div>

      <div className='mt-2'>
        <AssetAmountInput
          token={token1}
          value={amount1}
          onChange={(val) => onAmountsChanged(amount0, val, amount2)}
          maxDecimals={3}
          disabled={disabled || !isAddSelected}
          selectPair={selectPair}
        />
      </div>

      <div
        className={`bg-slate-100 dark:bg-zinc-900 w-10 h-10 -mt-4 -mb-4 mx-auto rounded-full select-none items-center justify-center flex z-20 relative border-2 border-brandDark/10 transition-transform duration-420 ease-in-out z-20 ${isAddSelected ? 'translate-y-0' : 'translate-y-[calc(-320%+1rem)]'} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        onClick={disabled ? () => {} : onArrowClick}>
            <ChevronDownIcon className="h-4 w-4" />
        </div>

      <div className={`transition-transform duration-300 ease-in-out ${isAddSelected ? 'translate-y-0' : 'translate-y-[calc(-200%-1rem)]'}`}>
        <AssetAmountInput
          token={token2}
          value={amount2}
          onChange={(val) => onAmountsChanged(amount0, amount1, val)}
          maxDecimals={3}
          disabled={disabled || isAddSelected}
          selectPair={selectPair}
        />
      </div>

    </div>
  );
};

export default LiquidityInput;
