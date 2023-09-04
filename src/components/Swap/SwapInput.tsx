import AssetAmountInput from "@/components/atomic/AssetAmountInput";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import { Token } from "../../api";

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
  disabled,
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
      <div
        className="p-1 items-center justify-center flex w-fill"
        onClick={disabled ? () => {} : onArrowClick}
      >
        <ChevronDownIcon
          className={`h-7 w-7 ${
            disabled
              ? "text-gray-300 cursor-not-allowed"
              : isBuySelected
              ? "text-green-700 cursor-pointer"
              : "text-red-800 cursor-pointer"
          } ${isBuySelected ? "" : "transform rotate-180"}`}
        />
      </div>
      <AssetAmountInput
        token={token1}
        value={amount1}
        onChange={(val) => onAmountsChanged(amount0, val)}
        maxDecimals={3}
        disabled={disabled}
      />
    </div>
  );
};

export default SwapInputs;
