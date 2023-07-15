import type WalletConnect from '../wallets/walletConnect';
import { Dialog, Transition } from '@headlessui/react';
import { createRoot } from 'react-dom/client';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import { generateOffer } from '../walletIntegrationInterface';


let closeModalFunction: () => void = () => {};

type CompleteWithWalletModalProps = {
  walletConnectInstance: WalletConnect
  onClose: () => void
}

const CompleteWithWalletModal = ({ walletConnectInstance, onClose }: CompleteWithWalletModalProps) => {

  const [isOpen, setIsOpen] = React.useState(true);
  const [step, setStep] = React.useState<number>(0);
  const [isAddAssetsRequired, setIsAddAssetsRequired] = React.useState(false)
  const [userMustAddTheseAssetsToWallet, setUserMustAddTheseAssetsToWallet] = React.useState<generateOffer["offerAssets"]>()
  const [title, setTitle] = React.useState("Fetch Wallets")

  React.useEffect(() => {
    // Assign callback functions from class to component functions
    if (walletConnectInstance) {
      walletConnectInstance.setOnGetWalletsAccept(handleGetWalletsAccept);
      walletConnectInstance.setOnAddAssets(handleOnAddAssets);
    }
  }, [walletConnectInstance]);

  // Callback function to update UI modal based on abstract class events
  const handleGetWalletsAccept = () => {
    setStep(1);
  };

  const handleOnAddAssets = (userMustAddTheseAssetsToWallet: generateOffer["offerAssets"]) => {
    setUserMustAddTheseAssetsToWallet(userMustAddTheseAssetsToWallet)
    setIsAddAssetsRequired(true);
    setTitle("Add Assets")
  };

  const addAssetToWallet = async (assetId: string, symbol: string, logo: string, fullName: string) => {
    if (!walletConnectInstance) return console.log('Connect to a wallet before trying to add an asset')
    await walletConnectInstance.addAsset(assetId, symbol, logo, fullName)
  }

  const fetchStep = (step: number) => {
    if (step === 0) {
        return (
            <div>
                <div className="flex gap-4 items-center">
                  {/* Pending Spinner */}
                  <div className="w-8 aspect-square border-2 border-black/10 rounded-full border-r-black dark:border-r-brandLight animate-spin"></div>
                  <p>We&apos;ve sent a request to fetch your Chia wallet tokens. Please accept this in your wallet.</p>
                </div>
                <div className="flex gap-2 mt-8 font-medium">
                  <button className="bg-red-700 text-brandLight px-4 py-2 rounded-lg focus:outline-none w-full transition duration-100" onClick={() => setIsOpen(false)}>Cancel</button>
                </div>
            </div>
        )
    }
    if (step === 1) {
        if (isAddAssetsRequired) {
          return (
            <div>
                <p>Add the below assets to your Chia Wallet before continuing</p>
                <ul className="list-none mt-4 font-medium">
                  {userMustAddTheseAssetsToWallet?.map((asset) => {
                    return (
                      <li key={asset.assetId} className="flex gap-2 justify-between pb-2 last:pb-0">
                        <div className="flex gap-2 items-center">
                            <Image src={asset.image_url} width={30} height={30} alt="Token logo" className="rounded-full outline-brandDark/20 p-0.5" priority />
                            <p>{asset.name} ({asset.short_name})</p>
                        </div>
                        <button className="hover:opacity-80 bg-brandDark/10 py-1 px-4 whitespace-nowrap rounded-lg flex items-center gap-2" onClick={() => addAssetToWallet(asset.assetId, asset.short_name, asset.image_url, asset.name)}>Add to Wallet</button>
                      </li>
                    )
                  })}
                </ul>

                <div className="flex gap-2 mt-8 font-medium">
                    <button className="bg-red-700 text-brandLight px-4 py-2 rounded-lg focus:outline-none w-full transition duration-100" onClick={() => setIsOpen(false)}>Cancel</button>
                    {/* <button className="bg-green-800 text-brandLight px-4 py-2 rounded-lg focus:outline-none w-full transition opacity-30 cursor-not-allowed duration-100" onClick={() => setStep(prev => prev+1)}>Next Step</button> */}
                </div>
            </div>
          )
        } else {
          return (
            <div>
                <p>Approve offer</p>
                <div className="flex gap-2 mt-8 font-medium">
                    <button className="bg-red-700 text-brandLight px-4 py-2 rounded-lg focus:outline-none w-full transition duration-100" onClick={() => setIsOpen(false)}>Cancel</button>
                    {/* <button className="bg-green-800 text-brandLight px-4 py-2 rounded-lg focus:outline-none w-full transition duration-100" onClick={() => setStep(prev => prev+1)}>Next Step</button> */}
                </div>
            </div>
          )
        }
    }
}

  return ReactDOM.createPortal(
    (
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={() => {}}>
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

                    <Dialog.Title as="h3" className="text-[2.5rem] sm:text-5xl pt-4 pb-4 font-bold text-black dark:text-brandLight">{title}</Dialog.Title>

                    {/* Wallet Options */}
                    <div className="mt-4 flex flex-col gap-4">
                    {fetchStep(step)}
                    </div>
                    </Dialog.Panel>
                </Transition.Child>
                </div>
            </div>
            </Dialog>
        </Transition>
    ),
    document.body,
  )
}

export const showCompleteWithWalletModal = (walletConnectInstance: WalletConnect) => {
  const modalDiv = document.createElement('div')
  document.body.appendChild(modalDiv)

  const root = createRoot(modalDiv)
  const onClose = () => {
    root.unmount()
    document.body.removeChild(modalDiv)
  }

  closeModalFunction = onClose;

  root.render(
    <CompleteWithWalletModal
      walletConnectInstance={walletConnectInstance}
      onClose={onClose}
    />,
  )

  return onClose
};

export const closeCompleteWithWalletModal = () => {
  if (closeModalFunction) {
    closeModalFunction()
  }
};
