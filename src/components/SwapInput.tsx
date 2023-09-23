import AssetAmountInput from "@/components/atomic/AssetAmountInput";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import type { Token } from "../api";
import { Transition } from "@headlessui/react";

type SwapInputsProps = {
  token0: Token;
  token1: Token;
  isBuySelected: boolean;
  onArrowClick: () => void;
  amount0: number;
  amount1: number;
  onAmountsChanged: (amount0: number, amount1: number) => void;
  disabled: boolean;
  selectToken: (token: Token) => void;
};

const SwapInputs: React.FC<SwapInputsProps> = ({
  token0,
  token1,
  isBuySelected,
  amount0,
  amount1,
  onAmountsChanged,
  onArrowClick,
  disabled,
  selectToken,
}) => {
  return (
    <div className="w-fill mt-8">

      <div className={`relative h-[102px] transition-transform ${isBuySelected ? 'translate-y-0' : 'translate-y-[calc(100%+0.5rem)]'}`}>
        <AssetAmountInput
          token={token0}
          value={amount0}
          onChange={(val) => onAmountsChanged(val, amount1)}
          maxDecimals={12}
          selectToken={selectToken}
          disabled={disabled}
        />
      </div>

      <div
        className={`bg-slate-100 dark:bg-zinc-900 w-10 h-10 -mt-4 -mb-4 mx-auto rounded-full select-none items-center justify-center flex z-10 relative border-2 border-brandDark/10 
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        onClick={disabled ? () => {} : onArrowClick}>
          <ChevronDownIcon className={`h-4 w-4 ${isBuySelected ? "" : "rotate-180"}`} />
      </div>

      <div className={`relative h-[102px] transition-transform ${isBuySelected ? 'translate-y-0' : 'translate-y-[calc(-100%-0.5rem)]'}`}>
        <AssetAmountInput
          token={token1}
          value={amount1}
          onChange={(val) => onAmountsChanged(amount0, val)}
          maxDecimals={3}
          selectToken={selectToken}
          disabled={disabled}
        />
      </div>

    </div>
  );
};

export default SwapInputs;
