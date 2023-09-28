import { setPairingUri } from '@/redux/walletConnectSlice';
import { Transition } from '@headlessui/react';
import CopyButton from '../atomic/CopyButton';
import { QRCodeSVG } from 'qrcode.react';
import { useAppDispatch } from '@/hooks';

interface WalletConnectQRProps {
  pairingUri: string | null;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

function WalletConnectQR({ pairingUri, isOpen, setIsOpen } : WalletConnectQRProps) {

  const dispatch = useAppDispatch();

  return ( 
    <Transition
      show={Boolean(isOpen)}
      enter="transition-all duration-300 ease-out"
      enterFrom="max-h-[0] opacity-0"
      enterTo="max-h-[300px] opacity-100"
      leave="transition-all duration-300 ease-in"
      leaveFrom="max-h-[300px] opacity-100"
      leaveTo="max-h-[0] opacity-0"
    >
      <div className="flex flex-col justify-center gap-2">
        {!pairingUri && <div className="w-[173px] h-[173px] m-[13px] rounded bg-brandDark/10 mx-auto animate-pulse"></div>}
        
        {pairingUri && (
          <QRCodeSVG
            className="animate-fadeIn"
            value={pairingUri}
            includeMargin
            width={"100%"}
            height={200}
            bgColor="#EDF0F1"
          />
        )}
        <button className="text-red-700 hover:opacity-80 w-fit mx-auto" onClick={() => {dispatch(setPairingUri(null)); setIsOpen(false)}}>Cancel</button>
        <CopyButton disabled={!Boolean(pairingUri)} copyText={pairingUri ? pairingUri : ''} height="36px">Copy pairing string</CopyButton>
      </div>
    </Transition> 
  );
}

export default WalletConnectQR;