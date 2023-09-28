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

                <div>
                    <p className="font-medium text-brandDark pb-2">Theme</p>
                    <ThemeSwitcher theme={theme} setTheme={setTheme} />
                </div>

                <div>
                    <p className="font-medium text-brandDark pb-2">Dev Fee</p>
                    <DevFeeSelector />
                </div>

            </div>
        </Modal>


     );
}

export default SettingsModal;