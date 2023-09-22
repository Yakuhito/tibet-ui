import TokenSelectorModal from '../modals/TokenSelectorModal';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import type { Token } from '../../api';
import { useState } from 'react';
import Image from "next/image";

interface TokenSelectorProps {
  selectedToken: Token;
  selectToken: (token: Token) => void;
  disabled?: boolean;
}

function TokenSelectorNew({ selectedToken, selectToken, disabled }: TokenSelectorProps) {
  
  const [isTokenSelectorModalOpen, setIsTokenSelectorModalOpen] = useState<boolean>(false);

  const isChia = selectedToken.name.toLowerCase().includes("chia") && !selectedToken.asset_id;
  const isPlaceholderToken = selectedToken.name === "Unknown Token";
  const isLiquidityPlaceholder = selectedToken.short_name === "TIBET-XXX-XCH";
  const isLiquidityToken = selectedToken.name === "Pair Liquidity Token";

  return (
    <>
      <div
        className={`h-fit text-brandDark dark:text-brandLight/80 transition flex justify-center items-center font-medium gap-2 rounded-full p-2 px-5 select-none 
        ${isChia || isLiquidityPlaceholder || isLiquidityToken
            ? `cursor-not-allowed px-4 pr-5 ${disabled ? 'opacity-30' : ''}`
            : "cursor-pointer bg-brandDark/10 hover:opacity-80 active:scale-[98%]"
        }
        ${isPlaceholderToken ? "px-3 bg-gradient-to-br from-[#7fa9b8]/90 to-brandDark/90 text-brandLight" : ""}
      `}
        onClick={() =>
          isChia || isLiquidityPlaceholder || isLiquidityToken
            ? null
            : setIsTokenSelectorModalOpen(true)
        }
      >
        {/* Token Image */}
        {selectedToken && !isPlaceholderToken && (
          <Image className="rounded-full border-0 border-brandLight animate-fadeIn max-h-[25px] aspect-square" src={selectedToken.image_url} width={25} height={25} alt={selectedToken.name} />
        )}

        {/* Token Name or "Select Token" if no token selected */}
        <p className="whitespace-nowrap">
          {selectedToken && !isPlaceholderToken
            ? selectedToken.short_name
            : "Select Token"}
        </p>

        {/* Down arrow icon if user is allowed to select */}
        {selectedToken &&
          !isChia &&
          !isLiquidityPlaceholder &&
          !isLiquidityToken && (
            <div className="w-4">
              <ChevronDownIcon className="w-4 pt-0.5" />
            </div>
          )}
      </div>
      <TokenSelectorModal isOpen={isTokenSelectorModalOpen} setIsOpen={setIsTokenSelectorModalOpen} setSelectedToken={selectToken} />
    </>
  );
}

export default TokenSelectorNew;