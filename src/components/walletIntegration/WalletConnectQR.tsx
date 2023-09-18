import { setPairingUri } from '@/redux/walletConnectSlice';
import CopyButton from '../atomic/CopyButton';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { QRCodeSVG } from 'qrcode.react';
import { useAppDispatch } from '@/hooks';

function WalletConnectQR() {

  const dispatch = useAppDispatch();

  const pairingUri = useSelector((state: RootState) => state.walletConnect.pairingUri);
  if (!pairingUri) return <></>

  return ( 
    <>
      <QRCodeSVG
        value={pairingUri}
        includeMargin
        width={"100%"}
        height={200}
        bgColor="#EDF0F1"
      />
      <button className="text-red-700" onClick={() => dispatch(setPairingUri(null))}>Cancel</button>
      <CopyButton copyText={pairingUri} height="36px">Copy pairing string</CopyButton>
    </>    
  );
}

export default WalletConnectQR;