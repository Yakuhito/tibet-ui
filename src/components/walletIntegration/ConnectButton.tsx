import ConnectWalletModal from './ConnectedWalletModal';
import { useState, useContext, useEffect } from 'react';
import WalletContext from '@/context/WalletContext';
import { useRouter } from 'next/router';
import Image from 'next/image';


function ConnectButton() {

    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
    const { walletManager, activeWallet } = useContext(WalletContext);
    const [address, setAddress] = useState<string | null | void>(null);
    const [isWalletOnWrongChain, setIsWalletOnWrongChain] = useState(false)
    const router = useRouter();

    useEffect(() => {
      // Fetch current wallet address & save to state
      const fetchAddress = async () => {
        if (activeWallet) {
          const address = await activeWallet.getAddress();
          setAddress(address);
        }
      };
      fetchAddress();

      //  If users wallet address shows that they are on the wrong chain, display a warning in ConnectedWalletModal
      if (address && address.charAt(0).toLowerCase() === "t" && process.env.NEXT_PUBLIC_XCH === "XCH") {
        setIsWalletOnWrongChain(true)
      } else if (address && address.charAt(0).toLowerCase() === "x" && process.env.NEXT_PUBLIC_XCH === "TXCH") {
        setIsWalletOnWrongChain(true)
      } else {
        setIsWalletOnWrongChain(false)
      }
      
    }, [activeWallet, router, address]);
  
    const displayAddress = () => {
      if (address && process.env.NEXT_PUBLIC_XCH) {
        const short_address = address.slice(0, 7) + '...' + address.slice(-4);
        return short_address ? short_address : 'Manage Wallet';
      }
      return 'Manage Wallet';
    };

    return ( 
        <>
            <button onClick={() => setIsWalletModalOpen(true)} className="flex items-center gap-2 bg-brandDark/10  text-brandDark dark:text-brandLight px-6 py-1.5 font-medium rounded-xl animate-fadeIn hover:opacity-80">
                {activeWallet?.image && <Image src={activeWallet.image} width={20} height={20} alt={`${activeWallet?.name} wallet logo`} className="rounded-full" />}
                {!activeWallet ? 'Connect Wallet' : displayAddress()}
            </button>
            <ConnectWalletModal
              isOpen={isWalletModalOpen}
              setIsOpen={setIsWalletModalOpen}
              walletManager={walletManager}
              activeWallet={activeWallet}
              isWalletOnWrongChain={isWalletOnWrongChain}
              walletType={activeWallet?.walletType}
            />
        </>
     );
}

export default ConnectButton;
