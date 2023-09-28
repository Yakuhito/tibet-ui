import { useState } from "react";
import Image from "next/image";

import { addAsset } from "@/redux/walletSlice";
import { useAppDispatch } from "@/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface AddAssetButtonProps {
    asset_id: string
    short_name: string
    image_url: string
    name: string
    onCompletion?: (assetId?: string) => void
}

function AddAssetButton({ asset_id, short_name, image_url, name, onCompletion = () => {} }: AddAssetButtonProps) {

    const dispatch = useAppDispatch();
    const connectedWallet = useSelector((state: RootState) => state.wallet.connectedWallet);
    const walletConnectSelectedSession = useSelector((state: RootState) => state.walletConnect.selectedSession);
    const walletName = useSelector((state: RootState) => state.wallet.name);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAdded, setIsAdded] = useState<boolean>(false);

    const addAssetToWallet = async (assetId: string, symbol: string, logo: string, fullName: string) => {
        setIsLoading(true);
        const response = await dispatch(addAsset({assetId, symbol, logo, fullName}));
        if (response.payload) {
            setIsAdded(true);
            onCompletion(assetId);
        }
        setIsLoading(false);
    }

    const isWalletConnectActuallyConnected = connectedWallet === "WalletConnect" ? Boolean(connectedWallet === "WalletConnect" && walletConnectSelectedSession) : true;

    // Only display button if it's supported by the active wallet
    if ((walletName === "Goby" ||  walletName === "WalletConnect") && connectedWallet && isWalletConnectActuallyConnected) {
        return ( 
            <button onClick={() => !isLoading && !isAdded ? addAssetToWallet(asset_id, short_name, image_url, name) : null} className={`${isLoading ? 'animate-pulse' : ''} ${isAdded ? 'bg-green-700/20 text-green-700 cursor-default hover:opacity-100' : 'bg-brandDark/10 text-brandDark dark:text-brandLight'} h-fit w-[144px] transition font-medium hover:opacity-80 py-1 px-4 whitespace-nowrap rounded-lg flex justify-center items-center gap-2`}>
                {!isLoading && !isAdded && <Image src={walletName === "Goby" ? "/assets/goby.webp" : "/assets/xch.webp"} width={16} height={16} alt="Token logo" className="rounded-full" />}
                {isLoading && <div className="w-3.5 aspect-square border-2 border-black/10 rounded-full border-r-brandDark dark:border-r-brandLight animate-spin"></div>}
                {isAdded ? 'Added' : 'Add to Wallet'}
            </button>
        );
    }
    return (<></>)
}

export default AddAssetButton;