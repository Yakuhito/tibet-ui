import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Image from 'next/image';
import WalletManager from '@/utils/walletIntegration/walletManager';
import GobyWallet from '@/utils/walletIntegration/wallets/gobyWallet';
import WalletConnect from '@/utils/walletIntegration/wallets/walletConnect';
import WalletIntegrationInterface from '@/utils/walletIntegration/walletIntegrationInterface';
import { useState, useEffect } from 'react';
import HoogiiWallet from '@/utils/walletIntegration/wallets/hoogiiWallet';
import { toast } from 'react-hot-toast';


interface ConnectWalletModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    walletManager: WalletManager | null;
    activeWallet: WalletIntegrationInterface | null;
}

function ConnectWalletModal({ isOpen, setIsOpen, walletManager, activeWallet }: ConnectWalletModalProps) {

    const handleConnect = async (walletIdentifier: string) => {
        // Get the wallet integration object based on the identifier
        let walletIntegration: WalletIntegrationInterface | null = null;
        let connectionSuccessful: boolean = false;
        if (walletIdentifier === activeWallet?.name) return // If already connected to that wallet, do nothing (or handle disconnect?)
        try {
            if (walletIdentifier === 'Goby') {
                console.log(activeWallet?.name)
              walletIntegration = new GobyWallet();
              const response = await walletIntegration.connect(); // Connect to the Goby wallet asynchronously
              connectionSuccessful = Boolean(response);
            } else if (walletIdentifier === 'Hoogii') {
                walletIntegration = new HoogiiWallet();
                const response = await walletIntegration.connect(); // Connect to the Hoogii wallet
                connectionSuccessful = Boolean(response);
            } else if (walletIdentifier === 'WalletConnect') {
              walletIntegration = new WalletConnect();
              walletIntegration.connect(); // Connect to the WalletConnect wallet
              connectionSuccessful = true;
            }
          } catch (error) {
            console.error('Error connecting to wallet:', error);
            connectionSuccessful = false;
          }
      
          if (connectionSuccessful && walletIntegration) {
            console.log('setting active wallet 🚀')
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

                        {/* Goby Wallet */}
                        <div onClick={() => handleConnect('Goby')} className={`${activeWallet instanceof GobyWallet ? 'bg-green-700/20 focus:ring-green-700/20' : 'bg-brandDark/10'} hover:opacity-80 group flex items-center justify-between border-2 border-transparent hover:border-brandDark/10 py-4 px-4 rounded-xl cursor-pointer`}>
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

                        {/* Hoogii Wallet */}
                        <div onClick={() => handleConnect('Hoogii')} className={`${activeWallet instanceof HoogiiWallet ? 'bg-green-700/20 focus:ring-green-700/20' : 'bg-brandDark/10'} hover:opacity-80 group flex items-center justify-between border-2 border-transparent hover:border-brandDark/10 py-4 px-4 rounded-xl cursor-pointer`}>
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

                        {/* Chia Wallet */}
                        <div className={`hover:opacity-80 bg-brandDark/10 group flex items-center justify-between border-2 border-transparent hover:border-brandDark/10 py-4 px-4 rounded-xl cursor-pointer`}>
                            <div className="flex items-center gap-4">
                                <Image src="/assets/xch.webp" height={40} width={40} alt={'Chia Wallet Logo'} className="rounded-full" />
                                <p className="font-medium text-lg">Chia Wallet</p>
                            </div>
                            <button className={`font-medium rounded-lg px-2 py-1 before:content-['Coming_Soon']`}></button>
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