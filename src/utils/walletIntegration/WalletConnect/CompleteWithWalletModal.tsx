import AddAssetButton from '@/components/walletIntegration/AddAssetButton';
import { generateOffer } from '../walletIntegrationInterface';
import type WalletConnect from '../wallets/walletConnect';
import { Dialog, Transition } from '@headlessui/react';
import { createRoot } from 'react-dom/client';
import React, { Fragment, useState } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';


let closeModalFunction: () => void = () => {};

type CompleteWithWalletModalProps = {
  walletConnectInstance: WalletConnect
  onClose: () => void
}

const CompleteWithWalletModal = ({ walletConnectInstance, onClose }: CompleteWithWalletModalProps) => {

  const [isOpen, setIsOpen] = React.useState(true)
  const [step, setStep] = React.useState<number>(0)
  const [addedAssetsCount, setAddedAssetsCount] = React.useState<number>(0)
  const [userMustAddTheseAssetsToWallet, setUserMustAddTheseAssetsToWallet] = React.useState<generateOffer["offerAssets"]>([])
  const [title, setTitle] = React.useState("Fetch Wallets")
  const [offerRejected, setOfferRejected] = React.useState(false)
  const [allAssetsAddedPromiseResolve, setAllAssetsAddedPromiseResolve] = React.useState<any>(null)

  React.useEffect(() => {
    if(!walletConnectInstance) return;

    // Callback from class that is run if user needs to add assets to their wallet before continuing
    const handleOnAddAssets = async (userMustAddTheseAssetsToWallet: generateOffer["offerAssets"]) => {
      if (userMustAddTheseAssetsToWallet.length) {
        setUserMustAddTheseAssetsToWallet(userMustAddTheseAssetsToWallet)
        setTitle("Add Assets")
        setStep(1);

        return new Promise<void>((resolve) => {
          console.log('hello from promise, ser')

          // important: can't only use 'resolve' since react will
          // run all functions given to setters
          setAllAssetsAddedPromiseResolve(() => resolve)
        })
      } else {
        setTitle("Generate Offer")
        setStep(2);
      }
    };

    // Callback when everything is good :) The modal kills itself though :'(
    const handleOnGenerateOfferSuccess = () => {
      setIsOpen(false);
      onClose();
    };

    // When offer is rejected in Chia wallet, update state to display red cross to user
    const handleOnGenerateOfferReject = () => {
      setOfferRejected(true);
    }

    // Assign callback functions from class to component functions
    walletConnectInstance.setOnAddAssets(handleOnAddAssets);
    walletConnectInstance.setOnGenerateOfferSuccess(handleOnGenerateOfferSuccess)
    walletConnectInstance.setOnGenerateOfferReject(handleOnGenerateOfferReject)
  }, [walletConnectInstance, onClose, setIsOpen, setStep, setTitle, setUserMustAddTheseAssetsToWallet]);

  // When user adds an asset in their wallet successfully, add count to added list
  const handleAssetAdded = () =>
    setAddedAssetsCount(addedAssetsCount => addedAssetsCount += 1);

  // If all assets have been added, move to next step (& run generateOffer from the top again)
  React.useEffect(() => {
    if (step === 1) {
      if (addedAssetsCount === userMustAddTheseAssetsToWallet.length) {
        setTitle("Fetch Wallets")
        setStep(1.5);

        if(allAssetsAddedPromiseResolve !== null) {
          allAssetsAddedPromiseResolve()
          setAllAssetsAddedPromiseResolve(null)
        }
      }
    }
  }, [addedAssetsCount, userMustAddTheseAssetsToWallet.length, step, allAssetsAddedPromiseResolve, setAllAssetsAddedPromiseResolve]);

  const fetchStep = (step: number) => {
    if (step === 0 || step === 1.5) {
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
      return (
        <div>
            <p>Add the below assets to your Chia Wallet before continuing</p>
            <ul className="list-none mt-4 flex flex-col gap-2 font-medium">
              {userMustAddTheseAssetsToWallet?.map((asset) => {
                return (
                  <li key={asset.assetId} className="flex items-center gap-2 justify-between pb-2 last:pb-0">
                    <div className="flex gap-4 items-center">
                        <Image src={asset.image_url} width={30} height={30} alt="Token logo" className="rounded-full outline-brandDark/20 p-0.5" priority />
                        {!asset.short_name.includes("TIBET-") && <p>{asset.name} ({asset.short_name})</p>}
                        {asset.short_name.includes("TIBET-") && <p>{asset.short_name}</p>}
                    </div>
                    <AddAssetButton asset_id={asset.assetId} short_name={asset.short_name} image_url={asset.image_url} name={asset.name} activeWallet={walletConnectInstance} onCompletion={handleAssetAdded} />
                  </li>
                )
              })}
            </ul>
            
            <div className="flex gap-2 mt-8 font-medium">
                <button className="bg-red-700 text-brandLight px-4 py-2 rounded-lg focus:outline-none w-full transition duration-100" onClick={() => setIsOpen(false)}>Cancel</button>
            </div>
        </div>
      )
    }
    if (step === 2) {
      return (
        <div>
          <div className="flex gap-4 items-center">
            {offerRejected && (
              <svg className="fill-red-700 max-w-[18px] w-8 aspect-square" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 490" xmlSpace="preserve">
                <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337 "/>
              </svg>
            )}
            {/* Pending Spinner */}
            {!offerRejected && <div className="max-w-[18px] w-8 aspect-square border-2 border-black/10 rounded-full border-r-black dark:border-r-brandLight animate-spin"></div>}
            <p>{offerRejected ? 'Offer request rejected. Please cancel and try again.' : "We've sent a request to generate the offer. Please review and accept this in your wallet."}</p>
          </div>
          <div className="flex gap-2 mt-8 font-medium">
            <button className="bg-red-700 text-brandLight px-4 py-2 rounded-lg focus:outline-none w-full transition duration-100" onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
      </div>
      )
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

                    <Dialog.Title as="h3" className="text-[2.5rem] sm:text-5xl pt-0 pb-4 font-bold text-black dark:text-brandLight">
                      <ul className="flex gap-2 mb-8">
                        <li className={`${step >= 0 ? 'bg-brandDark' : 'bg-brandDark/10'} w-full h-1 rounded-full`}></li>
                        <ul className="w-full flex">
                          <li className={`${step >= 1 ? 'bg-brandDark' : 'bg-brandDark/10'} w-full h-1 rounded-l-full`}></li>
                          <li className={`${step >= 1.5 ? 'bg-brandDark' : 'bg-brandDark/10'} w-full h-1 rounded-r-full`}></li>
                        </ul>
                        <li className={`${step >= 2 ? 'bg-brandDark' : 'bg-brandDark/10'} w-full h-1 rounded-full`}></li>
                      </ul>
                      
                      {title}
                    </Dialog.Title>

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
