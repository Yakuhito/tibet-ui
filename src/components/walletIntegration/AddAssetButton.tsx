import WalletIntegrationInterface from "@/utils/walletIntegration/walletIntegrationInterface";
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
}

function AddAssetButton({ asset_id, short_name, image_url, name, activeWallet }: AddAssetButtonProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAdded, setIsAdded] = useState<boolean>(false);

    const addAssetToWallet = async (assetId: string, symbol: string, logo: string, fullName: string) => {
        setIsLoading(true);
        if (!activeWallet) return toast.error('Connect to a wallet before trying to add an asset');
        const response = await activeWallet.addAsset(assetId, symbol, logo, fullName);
        if (response) {
            setIsAdded(true)
        }
        setIsLoading(false);
    }

    return ( 
        <button onClick={() => addAssetToWallet(asset_id, short_name, image_url, name)} className={`${isLoading ? 'animate-pulse' : ''} ${isAdded ? 'bg-green-700/20 text-green-700' : 'bg-brandDark/10 text-brandDark'} h-fit w-40 hover:opacity-80 py-1 px-4 whitespace-nowrap rounded-lg flex justify-center items-center gap-3`}>
            {!isLoading && !isAdded && <Image src={activeWallet instanceof GobyWallet ? "/assets/goby.webp" : "/assets/xch.webp"} width={16} height={16} alt="Token logo" className="rounded-full" />}
            {isLoading && <div className="w-4 aspect-square border border-black/10 rounded-full border-r-brandDark dark:border-r-brandLight animate-spin"></div>}
            {isAdded ? 'Added' : 'Add to Wallet'}
        </button>
     );
}

export default AddAssetButton;