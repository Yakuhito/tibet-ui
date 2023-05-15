import ConnectWalletModal from './ConnectedWalletModal';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as React from 'react';


function ConnectButton() {
    
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [connectedWallet, setConnectedWallet] = useState(false);
    const [isGobyDetected, setIsGobyDetected] = useState(false);
    
    // Detect whether a wallet is already connected
    useEffect(() => {
        const { chia } = (window as any);
        setIsGobyDetected(Boolean(chia && chia.isGoby));

        const eagerlyConnect = async () => {
            const isSuccessful = await (window as any).chia.request({ method: "connect" , "params": {eager: true}})
            if (isSuccessful) {
                setConnectedWallet(true)
            }
        }

        if (isGobyDetected) {
            console.log('Goby wallet detected - attempting to eagerly connect')
            eagerlyConnect()
        }
    }, [isGobyDetected, connectedWallet])


    const connectGobyWallet = async () => {
        if (!isGobyDetected) return toast.error(<p>You don&apos;t have Goby Wallet installed. You can install it <a href="https://www.goby.app/" className="underline hover:opacity-80" target="_blank">here</a></p>);
        if (!connectedWallet) {
            try {
                await (window as any).chia.request({ method: "connect" });
                const publicKeys = await (window as any).chia.request({ method: "getPublicKeys" });
                setConnectedWallet(true)
                toast.success('Successfully Connected')
            } catch (error: any) {
                console.log(error)
                toast.error(`Wallet - ${error?.message || String(error.message)}`); 
            }
        } else {
            console.log('Wallet already connected');
            toast.success('Wallet already connected');
        }
        return
    }

    const disconnectGobyWallet = async () => {
        console.log('Disconnect wallet');
        toast.success('Wallet already connected');
    }

    return ( 
        <>
            <button className="bg-brandDark/10 text-brandDark px-4 py-2 font-medium rounded-xl animate-fadeIn hover:opacity-80" onClick={() => setIsWalletModalOpen(true)}>{!connectedWallet ? 'Connect Wallet' : 'Manage Wallet'}</button>
            <ConnectWalletModal isOpen={isWalletModalOpen} setIsOpen={setIsWalletModalOpen} connectedWallet={connectedWallet} connectGobyWallet={connectGobyWallet} disconnectWalletFunc={disconnectGobyWallet} />
        </>
     );
}

export default ConnectButton;