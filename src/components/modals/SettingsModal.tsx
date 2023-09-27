import DevFeeSelector from '../DevFeeSelector';
import ThemeSwitcher from '../ThemeSwitcher';
import Modal from '../atomic/Modal';

interface ConnectWalletModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    theme: "dark" | "light" | "auto";
    setTheme: (theme: ConnectWalletModalProps['theme']) => void;
}

function SettingsModal({ isOpen, setIsOpen, theme, setTheme }: ConnectWalletModalProps) {
    return (    
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Settings">
            {/* Settings Options */}
            <div className="flex flex-col gap-4">

                <p className="font-medium">Theme</p>
                <ThemeSwitcher theme={theme} setTheme={setTheme} />

                <p className="font-medium">Dev Fee</p>
                <DevFeeSelector />

            </div>
        </Modal>


     );
}

export default SettingsModal;