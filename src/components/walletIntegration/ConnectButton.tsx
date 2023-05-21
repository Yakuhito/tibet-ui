import ConnectWalletModal from './ConnectedWalletModal';
import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import * as React from 'react';
import WalletManager from '@/utils/walletIntegration/walletManager';
import WalletIntegrationInterface from '@/utils/walletIntegration/walletIntegrationInterface';
import WalletContext from '@/context/WalletContext';


function ConnectButton() {

    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
    const { walletManager, activeWallet } = useContext(WalletContext);

    return ( 
        <>
            <button onClick={() => setIsWalletModalOpen(true)} className="bg-brandDark/10 dark:bg-brandDark/20 text-brandDark px-4 py-2 font-medium rounded-xl animate-fadeIn hover:opacity-80 dark:text-brandLight/50">{!activeWallet ? 'Connect Wallet' : 'Manage Wallet'}</button>
            <ConnectWalletModal isOpen={isWalletModalOpen} setIsOpen={setIsWalletModalOpen} walletManager={walletManager} activeWallet={activeWallet} />
        </>
     );
}

export default ConnectButton;