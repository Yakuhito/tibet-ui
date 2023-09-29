import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';

import CrossIcon from '../../icons/CrossIcon';

import FingerprintListbox from './FingerprintListbox';

import { selectSession, setSelectedFingerprint } from '@/redux/walletConnectSlice';
import { type RootState } from '@/redux/store';
import WalletManager from '@/utils/walletIntegration/walletManager';
import { useAppDispatch } from '@/hooks';
import WalletConnect from "@/utils/walletIntegration/wallets/walletConnect";



interface WalletConnectSession {
  img: string;
  name: string;
  topic: string;
}

function WalletConnectSession({ img, name, topic }: WalletConnectSession) {

  const dispatch = useAppDispatch();

  const [isHovering, setIsHovering] = useState(false);

  const connectedWallet = useSelector((state: RootState) => state.wallet.connectedWallet);
  const sessions = useSelector((state: RootState) => state.walletConnect.sessions);
  const selectedSession = useSelector((state: RootState) => state.walletConnect.selectedSession);
  const selectedFingerprint = useSelector((state: RootState) => state.walletConnect.selectedFingerprint)[topic];
  const isSelected = selectedSession ? selectedSession.topic === topic : false;
  
  
  // Fingerprint management
  const session = sessions.find(session => session.topic === topic);
  const defaultFingerprint = session ? Number(session.namespaces.chia.accounts[0].split(":")[2]) : 0;
  const [userSelectedFingerprint, setUserSelectedFingerprint] = useState<number | undefined>(selectedFingerprint ? selectedFingerprint : defaultFingerprint);
  const [fingerprints, setFingerprints] = useState<number[] | undefined>()

  const walletManager = new WalletManager();
  const walletConnect = new WalletConnect();

  // Set fingerprints array
  useEffect(() => {
    if (session) {
      const fingerprints = session.namespaces.chia.accounts.map(wallet => {
        return Number(wallet.split(":")[2]);
      });
      setFingerprints(fingerprints);
    }
  }, [session]);
  
  // When user updates the selected fingerprint, tell the Redux store to save that preference for the session topic
  useEffect(() => {
    if (userSelectedFingerprint) {
      dispatch(setSelectedFingerprint({ topic, selectedFingerprint: userSelectedFingerprint }));
    }
  }, [userSelectedFingerprint, dispatch, topic])

  
  const isConnectedWalletWalletConnect = useSelector((state: RootState) => state.wallet.connectedWallet) === "WalletConnect";

  const handleClick = () => {
    if (!isConnectedWalletWalletConnect) {
      walletManager.connect("WalletConnect")
    }
    dispatch(selectSession(topic));
  }

  return ( 
    <li onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} onClick={handleClick} className={`${isSelected && isConnectedWalletWalletConnect ? 'bg-green-700/20 text-green-700' : 'bg-brandDark/10'} ${isHovering && !isSelected ? 'bg-green-700/10 text-green-700': ''} select-none rounded-xl px-8 py-4 cursor-pointer hover:opacity-80 flex justify-between items-center w-full h-16 animate-fadeIn`}>
      <div className="flex gap-4 items-center">
        <Image src={img} height={40} width={40} alt={`${name} Wallet Logo`} className="rounded-full max-w-8 max-h-8 w-auto h-auto" />
        <div className="flex flex-col">
          {isHovering && !isSelected ? "Select" : name}
          <ul className="flex gap-1 text-xs">
            <FingerprintListbox fingerprints={fingerprints} userSelectedFingerprint={userSelectedFingerprint} setUserSelectedFingerprint={setUserSelectedFingerprint}  />
          </ul>
        </div>
      </div>
      <div>
        <button
          title="Remove session"
          className={`bg-red-700/80 hover:bg-red-700 rounded py-1 px-1 text-xs text-brandLight transition-opacity`}
          onMouseEnter={() => setIsHovering(false)}
          onMouseLeave={() => setIsHovering(true)}
          onClick={() => walletConnect.disconnectSession(topic)}
        >
          <CrossIcon className='fill-white' />
        </button>
      </div>
    </li>
   );
}

export default WalletConnectSession;