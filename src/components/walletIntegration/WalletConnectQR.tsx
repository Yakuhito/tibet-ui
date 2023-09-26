import { setPairingUri } from '@/redux/walletConnectSlice';
import { Transition } from '@headlessui/react';
import CopyButton from '../atomic/CopyButton';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppDispatch } from '@/hooks';

function WalletConnectQR({ pairingUri } : { pairingUri: string | null }) {

  const dispatch = useAppDispatch();
  const [savedPairingUri, setSavedPairingUri] = useState<string>("");
  useEffect(() => {
    if (pairingUri) {
      setSavedPairingUri(pairingUri);
    }
  }, [pairingUri]);

  return ( 
    <Transition
      show={Boolean(pairingUri)}
      enter="transition-all duration-300"
      enterFrom="max-h-[0] opacity-0"
      enterTo="max-h-[256px] opacity-100"
      leave="transition-all duration-300"
      leaveFrom="max-h-[256px] opacity-100"
      leaveTo="max-h-[0] opacity-0"
    >
      <div className="flex flex-col justify-center gap-2">
        <QRCodeSVG
          value={savedPairingUri}
          includeMargin
          width={"100%"}
          height={200}
          bgColor="#EDF0F1"
        />
        <button className="text-red-700" onClick={() => dispatch(setPairingUri(null))}>Cancel</button>
        <CopyButton copyText={savedPairingUri} height="36px">Copy pairing string</CopyButton>
      </div>
    </Transition> 
  );
}

export default WalletConnectQR;