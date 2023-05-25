import ConnectWalletModal from './ConnectedWalletModal';
import WalletContext from '@/context/WalletContext';
import { useState, useContext } from 'react';
import Image from 'next/image';


function ConnectButton() {

    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
    const { walletManager, activeWallet } = useContext(WalletContext);

    return ( 
        <>
            <button onClick={() => setIsWalletModalOpen(true)} className="flex items-center gap-2 bg-brandDark/10 dark:bg-brandDark/20 text-brandDark px-4 py-2 font-medium rounded-xl animate-fadeIn hover:opacity-80 dark:text-brandLight/50">
                {activeWallet?.image && <Image src={activeWallet.image} width={20} height={20} alt={`${activeWallet?.name} wallet logo`} className="rounded-full" />}
                {!activeWallet ? 'Connect Wallet' : 'Manage Wallet'}
            </button>
            <ConnectWalletModal isOpen={isWalletModalOpen} setIsOpen={setIsWalletModalOpen} walletManager={walletManager} activeWallet={activeWallet} />
        </>
     );
}

export default ConnectButton;