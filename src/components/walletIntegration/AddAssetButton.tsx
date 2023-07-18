import WalletIntegrationInterface from "@/utils/walletIntegration/walletIntegrationInterface";
import WalletConnect from "@/utils/walletIntegration/wallets/walletConnect";
import GobyWallet from "@/utils/walletIntegration/wallets/gobyWallet";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Image from "next/image";

interface AddAssetButtonProps {
    asset_id: string
    short_name: string
    image_url: string
    name: string
    activeWallet: WalletIntegrationInterface | null
    onCompletion?: () => void
}

function AddAssetButton({ asset_id, short_name, image_url, name, activeWallet, onCompletion = () => {} }: AddAssetButtonProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAdded, setIsAdded] = useState<boolean>(false);

    const addAssetToWallet = async (assetId: string, symbol: string, logo: string, fullName: string) => {
        setIsLoading(true);
        if (!activeWallet) return toast.error('Connect to a wallet before trying to add an asset');
        const response = await activeWallet.addAsset(assetId, symbol, logo, fullName);
        if (response) {
            setIsAdded(true);
            onCompletion();
        }
        setIsLoading(false);
    }

    // Only display button if it's supported by the active wallet
    if (activeWallet instanceof GobyWallet ||  activeWallet instanceof WalletConnect) {
        return ( 
            <button onClick={() => !isLoading && !isAdded ? addAssetToWallet(asset_id, short_name, image_url, name) : null} className={`${isLoading ? 'animate-pulse' : ''} ${isAdded ? 'bg-green-700/20 text-green-700 cursor-default hover:opacity-100' : 'bg-brandDark/10 text-brandDark dark:text-brandLight'} h-fit w-[144px] transition font-medium hover:opacity-80 py-1 px-4 whitespace-nowrap rounded-lg flex justify-center items-center gap-2`}>
                {!isLoading && !isAdded && <Image src={
                    activeWallet instanceof GobyWallet ? "/assets/goby.webp" : activeWallet.walletType === "chia" ? "/assets/xch.webp" : "/assets/ozone.png"
                } width={16} height={16} alt="Token logo" className="rounded-full" />}
                {isLoading && <div className="w-3.5 aspect-square border-2 border-black/10 rounded-full border-r-brandDark dark:border-r-brandLight animate-spin"></div>}
                {isAdded ? 'Added' : 'Add to Wallet'}
            </button>
        );
    }
    return (<></>)
}

export default AddAssetButton;
