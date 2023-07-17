import { Dialog, Transition } from '@headlessui/react';
import ThemeSwitcher from '../ThemeSwitcher';
import { Fragment } from 'react';

interface ConnectWalletModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    theme: "dark" | "light" | "auto";
    setTheme: (theme: ConnectWalletModalProps['theme']) => void;
}

function SettingsModal({ isOpen, setIsOpen, theme, setTheme }: ConnectWalletModalProps) {
    return (    
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={() => setIsOpen(false)}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-brandDark/10 backdrop-blur-sm" />
            </Transition.Child>
    
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">

                    <Dialog.Title as="h3" className="text-[2.5rem] sm:text-5xl pt-4 pb-4 font-bold text-black dark:text-brandLight">Settings</Dialog.Title>

                    {/* Settings Options */}
                    <div className="mt-10 flex flex-col gap-4">

                        <ThemeSwitcher theme={theme} setTheme={setTheme} />

                        {/* Example Settings Menu Item */}
                        {/* <div className={`hover:opacity-80 bg-brandDark/10 group flex items-center justify-between border-2 border-transparent hover:border-brandDark/10 py-4 px-4 rounded-xl cursor-pointer`}>
                            <div className="flex items-center gap-4">
                                <Image src="/assets/xch.webp" height={40} width={40} alt={'Chia Wallet Logo'} className="rounded-full" />
                                <p className="font-medium text-lg">Chia Wallet</p>
                            </div>
                            <button className={`font-medium rounded-lg px-2 py-1 before:content-['Coming_Soon']`}></button>
                        </div> */}

                    </div>
                    </Dialog.Panel>
                </Transition.Child>
                </div>
            </div>
            </Dialog>
        </Transition>
     );
}

export default SettingsModal;