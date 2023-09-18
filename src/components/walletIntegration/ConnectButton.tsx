import { selectSession } from '@/redux/walletConnectSlice';
import ConnectWalletModal from './ConnectedWalletModal';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/hooks';
import Image from 'next/image';


function ConnectButton() {

    const dispatch = useAppDispatch();

    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
    const [isWalletOnWrongChain, setIsWalletOnWrongChain] = useState(false)

    const connectedWallet = useSelector((state: RootState) => state.wallet.connectedWallet);
    const address = useSelector((state: RootState) => state.wallet.address);
    const walletImage = useSelector((state: RootState) => state.wallet.image);
    const walletName = useSelector((state: RootState) => state.wallet.name);
    const walletConnectSelectedSession = useSelector((state: RootState) => state.walletConnect.selectedSession);
    const walletConnectSessions = useSelector((state: RootState) => state.walletConnect.sessions);
    const displayWalletImage = (() => {
      if (walletName === "WalletConnect" && walletConnectSelectedSession) {
        return walletConnectSelectedSession.peer.metadata.icons[0];
      } else if (connectedWallet === "WalletConnect" && !walletConnectSelectedSession && walletConnectSessions.length) {
        dispatch(selectSession(walletConnectSessions[0].topic));
        return walletConnectSessions[0].peer.metadata.icons[0];
      } else {
        return walletImage;
      }
    })();


    useEffect(() => {
      //  If users wallet address shows that they are on the wrong chain, display a warning in ConnectedWalletModal
      if (address && address.charAt(0).toLowerCase() === "t" && process.env.NEXT_PUBLIC_XCH === "XCH") {
        setIsWalletOnWrongChain(true)
      } else if (address && address.charAt(0).toLowerCase() === "x" && process.env.NEXT_PUBLIC_XCH === "TXCH") {
        setIsWalletOnWrongChain(true)
      } else {
        setIsWalletOnWrongChain(false)
      }
      
    }, [address]);
  
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
                {(connectedWallet && displayWalletImage) && <Image src={displayWalletImage} width={20} height={20} alt={`${walletName} wallet logo`} className="rounded-full" />}
                {!connectedWallet || (connectedWallet === "WalletConnect" && !walletConnectSelectedSession) ? 'Connect Wallet' : displayAddress()}
            </button>
            <ConnectWalletModal isOpen={isWalletModalOpen} setIsOpen={setIsWalletModalOpen} isWalletOnWrongChain={isWalletOnWrongChain} />
        </>
     );
}

export default ConnectButton;