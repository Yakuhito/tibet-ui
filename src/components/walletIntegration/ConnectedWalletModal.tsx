import WalletIntegrationInterface from '@/utils/walletIntegration/walletIntegrationInterface';
import WalletConnect from '@/utils/walletIntegration/wallets/walletConnect';
import HoogiiWallet from '@/utils/walletIntegration/wallets/hoogiiWallet';
import GobyWallet from '@/utils/walletIntegration/wallets/gobyWallet';
import WalletManager from '@/utils/walletIntegration/walletManager';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface ConnectWalletModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    walletManager: WalletManager | null;
    activeWallet: WalletIntegrationInterface | null;
    isWalletOnWrongChain: boolean;
}

function ConnectWalletModal({ isOpen, setIsOpen, walletManager, activeWallet,isWalletOnWrongChain }: ConnectWalletModalProps) {
    const [fingerprints, setFingerprints] = useState([])
    const [selectedFingerprint, setSelectedFingerprint] = useState<null | number>()

    // Restore Chia Wallet fingerprints from local storage
    useEffect(() => {
        const fingerprints_ls = localStorage.getItem("wc_fingerprints")
        const selectedFingerprint_ls = localStorage.getItem("wc_selectedFingerprint")

        if (fingerprints_ls) setFingerprints(JSON.parse(fingerprints_ls))
        if (selectedFingerprint_ls) setSelectedFingerprint(JSON.parse(selectedFingerprint_ls))
    },[])

    const handleSwitchChiaWallet = (fingerprint: number) => {
        setSelectedFingerprint(fingerprint);
        localStorage.setItem("wc_selectedFingerprint", JSON.stringify(fingerprint))
        toast.success(<p className="break-words max-w-[18rem]">Switched to wallet fingerprint <span className="font-mono bg-brandDark/10 text-brandDark/90 px-1 rounded-sm">{fingerprint}</span></p>)
    }

    // Handle connecting to a wallet when clicking on an option
    const handleConnect = async (walletIdentifier: string) => {
        // Get the wallet integration object based on the identifier
        let walletIntegration: WalletIntegrationInterface | null = null;
        let connectionSuccessful: boolean = false;
        if (walletIdentifier === activeWallet?.name) return // If already connected to that wallet, do nothing (or handle disconnect?)

        // Try connecting to wallet option selected by user
        try {
            if (walletIdentifier === 'Goby') {
                walletIntegration = new GobyWallet();
                const response = await walletIntegration.connect(); // Connect to Goby wallet
                connectionSuccessful = Boolean(response);
            } else if (walletIdentifier === 'Hoogii') {
                walletIntegration = new HoogiiWallet();
                const response = await walletIntegration.connect(); // Connect to Hoogii wallet
                connectionSuccessful = Boolean(response);
            } else if (walletIdentifier === 'WalletConnect') {
                walletIntegration = new WalletConnect();
                const response = await walletIntegration.connect(); // Connect to WalletConnect (Chia Wallet)
                connectionSuccessful = Boolean(response);
            }
        } catch (error) {
            console.error('Error connecting to wallet:', error);
            connectionSuccessful = false;
        }
        // Update activeWallet state
        if (connectionSuccessful && walletIntegration) {
            walletManager ? walletManager.setActiveWallet(walletIntegration) : null;
        }
    };

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

                    <Dialog.Title as="h3" className="text-[2.5rem] sm:text-5xl pt-4 pb-4 font-bold text-black dark:text-brandLight">Connect Wallet</Dialog.Title>

                    {/* Wallet Options */}
                    <div className="mt-10 flex flex-col gap-4">

                        {/* Chia Wallet */}
                        <div>
                            <div onClick={() => handleConnect('WalletConnect')} className={`${activeWallet instanceof WalletConnect ? 'bg-green-700/20 focus:ring-green-700/20 rounded-t-xl' : 'bg-brandDark/10 rounded-xl'} hover:opacity-80 group flex items-center justify-between border-2 border-transparent hover:border-brandDark/10 py-4 px-4 cursor-pointer`}>
                                <div className="flex items-center gap-4">
                                    <Image src="/assets/xch.webp" height={40} width={40} alt={'Chia Wallet Logo'} className="rounded-full" />
                                    <p className="font-medium text-lg">Chia Wallet</p>
                                </div>
                                <button className={`
                                ${activeWallet instanceof WalletConnect ? 'outline-none text-green-700' : ''}
                                font-medium rounded-lg px-2 py-1
                                ${activeWallet instanceof WalletConnect ? "before:content-['Connected']" : "before:content-['Connect']"}`}
                                ></button>
                            </div>
                            <div className="animate-fadeIn text-sm bg-brandDark/10 font-medium px-4 py-4 rounded-b-xl flex flex-col gap-2 border-2 border-transparent hover:border-brandDark/10">
                                <p className="text-base">Your Wallets</p>
                                <ul className="flex">
                                {
                                    fingerprints.map(fingerprint => (
                                        <li onClick={() => handleSwitchChiaWallet(fingerprint)} className={`select-none rounded-full px-4 py-1 ${fingerprint == selectedFingerprint ? 'bg-green-700/20 focus:ring-green-700/20 text-green-700' : 'cursor-pointer hover:opacity-80'}`} key={fingerprint}>{fingerprint}</li>
                                    ))
                                }
                                </ul>
                            </div>
                        </div>
                        
                        {/* Goby Wallet */}
                        <div>
                            <div onClick={() => handleConnect('Goby')} className={`${activeWallet instanceof GobyWallet ? 'bg-green-700/20 focus:ring-green-700/20' : 'bg-brandDark/10'} ${isWalletOnWrongChain && activeWallet instanceof GobyWallet ? 'rounded-t-xl' : 'rounded-xl'} hover:opacity-80 group flex items-center justify-between border-2 border-transparent hover:border-brandDark/10 py-4 px-4 cursor-pointer`}>
                            <div className="flex items-center gap-4">
                                    <Image src="/assets/goby.webp" height={40} width={40} alt={'Goby Wallet Logo'} className="rounded-full" />
                                    <p className="font-medium text-lg">Goby Wallet</p>
                                </div>
                                <button className={`
                                ${activeWallet instanceof GobyWallet ? 'outline-none text-green-700' : ''}
                                font-medium rounded-lg px-2 py-1
                                ${activeWallet instanceof GobyWallet ? "before:content-['Connected']" : "before:content-['Connect']"}`}
                                ></button>
                            </div>
                            {isWalletOnWrongChain && activeWallet instanceof GobyWallet && <p className="animate-fadeIn text-sm bg-red-700/80 font-medium text-brandLight px-2 py-1 rounded-b-xl text-center">Incorrect chain selected ({process.env.NEXT_PUBLIC_XCH === "TXCH" ? 'Mainnet' : 'Testnet'})</p>}
                        </div>

                        {/* Hoogii Wallet */}
                        <div>
                            <div onClick={() => handleConnect('Hoogii')} className={`${activeWallet instanceof HoogiiWallet ? 'bg-green-700/20 focus:ring-green-700/20' : 'bg-brandDark/10'} ${isWalletOnWrongChain && activeWallet instanceof HoogiiWallet ? 'rounded-t-xl' : 'rounded-xl'} hover:opacity-80 group flex items-center justify-between border-2 border-transparent hover:border-brandDark/10 py-4 px-4 cursor-pointer`}>
                            <div className="flex items-center gap-4">
                                    <Image src="/assets/hoogii.png" height={40} width={40} alt={'Hoogii Wallet Logo'} className="rounded-full" />
                                    <p className="font-medium text-lg">Hoogii Wallet</p>
                                </div>
                                <button className={`
                                ${activeWallet instanceof HoogiiWallet ? 'outline-none text-green-700' : ''}
                                font-medium rounded-lg px-2 py-1
                                ${activeWallet instanceof HoogiiWallet ? "before:content-['Connected']" : "before:content-['Connect']"}`}
                                ></button>
                            </div>
                            {isWalletOnWrongChain && activeWallet instanceof HoogiiWallet && <p className="animate-fadeIn text-sm bg-red-700/80 font-medium text-brandLight px-2 py-1 rounded-b-xl text-center">Incorrect chain selected ({process.env.NEXT_PUBLIC_XCH === "TXCH" ? 'Mainnet' : 'Testnet'})</p>}
                        </div>
                    </div>
                    </Dialog.Panel>
                </Transition.Child>
                </div>
            </div>
            </Dialog>
        </Transition>
     );
}

export default ConnectWalletModal;
