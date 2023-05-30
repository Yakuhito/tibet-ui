import ConnectWalletModal from './ConnectedWalletModal';
import { useState, useContext, useEffect } from 'react';
import WalletContext from '@/context/WalletContext';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Image from 'next/image';


function ConnectButton() {

    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
    const { walletManager, activeWallet } = useContext(WalletContext);
    const [address, setAddress] = useState<string | null | void>(null);
    const router = useRouter();

    // Fetch current wallet address. If address indicates they are on the wrong site (i.e. mainnet / testnet), then redirect them to the correct one
    useEffect(() => {
      const fetchAddress = async () => {
        if (activeWallet) {
          const address = await activeWallet.getAddress();
          setAddress(address);
          //  If users wallet address shows that they are on the wrong chain, redirect them to the right one
           if (address && address.charAt(0).toLowerCase() === "t" && process.env.NEXT_PUBLIC_XCH === "XCH") {
            // User should be on testnet site
            // Redirect to the testnet url
            toast.error(
                <p>Your wallet is running testnet. Please switch to mainnet to use this site or use our testnet site <a className="underline hover:opacity-80" href="https://v2.tibetswap.io/" target="_blank">here</a></p>,
                {duration: 15000}
            )
          } else if (address && address.charAt(0).toLowerCase() === "x" && process.env.NEXT_PUBLIC_XCH === "TXCH") {
            // User should be on mainnet site
            // Redirect to the mainnet url
            toast.error(
                <p>Your wallet is running testnet. Please switch to mainnet to use this site or use our testnet site <a className="underline hover:opacity-80" href="https://v2-testnet10.tibetswap.io/" target="_blank">here</a></p>,
                {duration: 15000}
            )
          }
        }
      };
  
      fetchAddress();
    }, [activeWallet, router]);
  
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
            <ConnectWalletModal isOpen={isWalletModalOpen} setIsOpen={setIsWalletModalOpen} walletManager={walletManager} activeWallet={activeWallet} />
        </>
     );
}

export default ConnectButton;