import ConnectWalletModal from './ConnectedWalletModal';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as React from 'react';
import WalletManager from '@/utils/walletIntegration/walletManager';
import WalletIntegrationInterface from '@/utils/walletIntegration/walletIntegrationInterface';


function ConnectButton() {

    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
    const [walletManager, setWalletManager] = useState<WalletManager | null>(null)
    const [activeWallet, setActiveWallet] = useState<WalletIntegrationInterface | null>(null);
    
    useEffect(() => {
        setWalletManager(WalletManager.getInstance());

        const setActiveWalletState = async () => {
            setActiveWallet(walletManager ? await walletManager.getActiveWallet() : null);
        }
        setActiveWalletState()

    }, [walletManager, isWalletModalOpen])

    return ( 
        <>
            <button onClick={() => setIsWalletModalOpen(true)} className="bg-brandDark/10 dark:bg-brandDark/20 text-brandDark px-4 py-2 font-medium rounded-xl animate-fadeIn hover:opacity-80 dark:text-brandLight/50">{!activeWallet ? 'Connect Wallet' : 'Manage Wallet'}</button>
            <ConnectWalletModal isOpen={isWalletModalOpen} setIsOpen={setIsWalletModalOpen} walletManager={walletManager} activeWallet={activeWallet} />
        </>
     );
}

export default ConnectButton;