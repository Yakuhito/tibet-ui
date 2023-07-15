import GobyWallet from "@/utils/walletIntegration/wallets/gobyWallet";
import WalletContext from "@/context/WalletContext";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import Image from "next/image";

interface AddAssetButtonProps {
    asset_id: string
    short_name: string
    image_url: string
    name: string
}

function AddAssetButton({ asset_id, short_name, image_url, name }: AddAssetButtonProps) {

    const { activeWallet } = useContext(WalletContext);

    const addAssetToWallet = async (assetId: string, symbol: string, logo: string, fullName: string) => {
        if (!activeWallet) return toast.error('Connect to a wallet before trying to add an asset')
        await activeWallet.addAsset(assetId, symbol, logo, fullName)
    }

    return ( 
        <button onClick={() => addAssetToWallet(asset_id, short_name, image_url, name)} className="hover:opacity-80 bg-brandDark/10 py-1 px-4 whitespace-nowrap rounded-lg flex items-center gap-2">
            <Image src={activeWallet instanceof GobyWallet ? "/assets/goby.webp" : "/assets/xch.webp"} width={15} height={15} alt="Token logo" className="rounded-full" />
            Add to Wallet
        </button>
     );
}

export default AddAssetButton;