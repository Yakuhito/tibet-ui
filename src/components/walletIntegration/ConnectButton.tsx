import ConnectWalletModal from './ConnectedWalletModal';
import WalletContext from '@/context/WalletContext';
import { useState, useContext } from 'react';
import Image from 'next/image';


function ConnectButton() {

    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
    const { walletManager, activeWallet } = useContext(WalletContext);

    const displayAddress = () => {
        if (activeWallet) {
            const address = activeWallet.getAddress()
            if (address && process.env.NEXT_PUBLIC_XCH) {
                const short_address = address.slice(0, 7) + '...' + address.slice(-4)
                return short_address ? short_address : 'Manage Wallet';
            }
        }
        return 'Manage Wallet';
    }

    return ( 
        <>
            <button onClick={() => setIsWalletModalOpen(true)} className="flex items-center gap-2 bg-brandDark/10  text-brandDark dark:text-brandLight px-6 py-1.5 font-medium rounded-xl animate-fadeIn hover:opacity-80">
                {activeWallet?.image && <Image src={activeWallet.image} width={20} height={20} alt={`${activeWallet?.name} wallet logo`} className="rounded-full" />}
                {!activeWallet ? 'Connect Wallet' : displayAddress()}
            </button>
            <ConnectWalletModal isOpen={isWalletModalOpen} setIsOpen={setIsWalletModalOpen} walletManager={walletManager} activeWallet={activeWallet} />
        </>
     );
}

export default ConnectButton;