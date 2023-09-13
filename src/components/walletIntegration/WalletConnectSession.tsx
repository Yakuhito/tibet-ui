import { disconnectSession, selectSession } from '@/redux/walletConnectSlice';
import { connectWallet } from '@/redux/walletSlice';
import CrossIcon from '../icons/CrossIcon';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/hooks';
import { useState } from 'react';
import Image from 'next/image';


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
  const selectedFingerprint = useSelector((state: RootState) => state.walletConnect.selectedFingerprint);
  const isSelected = selectedSession ? selectedSession.topic === topic : false;

  const isConnectedWalletWalletConnect = useSelector((state: RootState) => state.wallet.connectedWallet) === "WalletConnect";

  const handleClick = () => {
    if (!isConnectedWalletWalletConnect) {
      dispatch(connectWallet("WalletConnect"));
    }
    dispatch(selectSession(topic));
  }

  const displayFingerprints = () => {
    const session = sessions.find(session => session.topic === topic);
    if (sessions.length && session && selectedSession) {
      const fingerprints = session.namespaces.chia.accounts.map(wallet => {
        return Number(wallet.split(":")[2]);
      });
      const isActiveWallet = selectedSession.topic === topic;
      return fingerprints.map(fingerprint => {
        const isSelectedFingerprint = selectedFingerprint == fingerprint;
        return (
          <li className={`${isSelectedFingerprint && isActiveWallet && connectedWallet === "WalletConnect" ? "bg-green-700 text-brandLight" : ""} px-2 rounded-full`} key={fingerprint}>{fingerprint}</li>
        )
      })
    }
    return <></>
  }

  return ( 
    <li onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} onClick={handleClick} className={`${isSelected && isConnectedWalletWalletConnect ? 'bg-green-700/20 text-green-700' : 'bg-brandDark/10'} ${isHovering && !isSelected ? 'bg-green-700/10 text-green-700': ''} select-none rounded-xl px-8 py-4 cursor-pointer hover:opacity-80 flex justify-between items-center w-full h-16 animate-fadeIn`}>
      <div className="flex gap-4 items-center">
        <Image src={img} height={40} width={40} alt={`${name} Wallet Logo`} className="rounded-full max-w-8 max-h-8 w-auto h-auto" />
        <div className="flex flex-col">
          {isHovering && !isSelected ? "Select" : name}
          <ul className="flex gap-1 text-xs">
            {displayFingerprints()}
          </ul>
        </div>
      </div>
      <div>
        <button
          title="Remove session"
          className={`bg-red-700/80 hover:bg-red-700 rounded py-1 px-1 text-xs text-brandLight transition-opacity`}
          onMouseEnter={() => setIsHovering(false)}
          onMouseLeave={() => setIsHovering(true)}
          onClick={() => dispatch(disconnectSession(topic))}
        >
          <CrossIcon className='fill-white' />
        </button>
      </div>
    </li>
   );
}

export default WalletConnectSession;