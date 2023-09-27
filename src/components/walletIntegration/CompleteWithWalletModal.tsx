import { setUserMustAddTheseAssetsToWallet, setOfferRejected, setRequestStep } from '@/redux/completeWithWalletSlice';
import AddAssetButton from '@/components/walletIntegration/AddAssetButton';
import { Dialog, Transition } from '@headlessui/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/hooks';
import React, { Fragment } from 'react';
import Image from 'next/image';

const CompleteWithWalletModal = () => {

  const dispatch = useAppDispatch();
  const step = useSelector((state: RootState) => state.completeWithWallet.requestStep);
  const userMustAddTheseAssetsToWallet = useSelector((state: RootState) => state.completeWithWallet.userMustAddTheseAssetsToWallet);
  const offerRejected = useSelector((state: RootState) => state.completeWithWallet.offerRejected);

  const title = (() => {
    switch (step) {
      case "getWallets":
        return "Fetch Wallets"
      case "getWalletsAgain":
        return "Fetch Wallets"
      case "addAssets":
        return "Add Assets"
      case "generateOffer":
        return "Generate Offer"
      default:
        return "";
    }
  })();

  const cancelTransaction = () => {
    dispatch(setOfferRejected(true));
    dispatch(setRequestStep(null));
    dispatch(setUserMustAddTheseAssetsToWallet([]));
  }

  const handleAssetAdded = (assetId?: string) => {
    if (!assetId) return;
    const updatedAssetList = userMustAddTheseAssetsToWallet.filter(asset => asset.assetId !== assetId);
    dispatch(setUserMustAddTheseAssetsToWallet(updatedAssetList));
  }
  
  const fetchStep = () => {
    if (step === "getWallets" || step === "getWalletsAgain") {
        return (
            <div>
                <div className="flex gap-4 items-center">
                  {/* Pending Spinner */}
                  <div className="w-8 aspect-square border-2 border-black/10 rounded-full border-r-black dark:border-r-brandLight animate-spin"></div>
                  <p>We&apos;ve sent a request to fetch your Chia wallet tokens. Please accept this in your wallet.</p>
                </div>
                <div className="flex gap-2 mt-8 font-medium">
                  <button className="bg-red-700 text-brandLight px-4 py-2 rounded-lg focus:outline-none w-full transition duration-100" onClick={cancelTransaction}>Cancel</button>
                </div>
            </div>
        )
    }
    if (step === "addAssets") {
      return (
        <div>
            <p>Please add these assets to your Chia Wallet before continuing:</p>
            <ul className="list-none mt-4 flex flex-col gap-2 font-medium">
              {userMustAddTheseAssetsToWallet?.map((asset) => {
                return (
                  <li key={asset.assetId} className="flex items-center gap-2 justify-between pb-2 last:pb-0">
                    <div className="flex gap-4 items-center">
                        <Image src={asset.image_url} width={30} height={30} alt="Token logo" className="rounded-full outline-brandDark/20 p-0.5" priority />
                        {!asset.short_name.includes("TIBET-") && <p>{asset.name} ({asset.short_name})</p>}
                        {asset.short_name.includes("TIBET-") && <p>{asset.short_name}</p>}
                    </div>
                    <AddAssetButton asset_id={asset.assetId} short_name={asset.short_name} image_url={asset.image_url} name={asset.name} onCompletion={handleAssetAdded} />
                  </li>
                )
              })}
            </ul>
            
            <div className="flex gap-2 mt-8 font-medium">
                <button className="bg-red-700 text-brandLight px-4 py-2 rounded-lg focus:outline-none w-full transition duration-100" onClick={cancelTransaction}>Cancel</button>
            </div>
        </div>
      )
    }
    if (step === "generateOffer") {
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
            <button className="bg-red-700 text-brandLight px-4 py-2 rounded-lg focus:outline-none w-full transition duration-100" onClick={cancelTransaction}>Cancel</button>
          </div>
      </div>
      )
    }
}

  if (!step) return <></>

  return (
    <Transition appear show={Boolean(step)} as={Fragment}>
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
          <div className="fixed inset-0 bg-brandDark/10 backdrop-blur" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end sm:items-center justify-center p-4 text-center">
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

              <Dialog.Title as="h3" className="text-2xl sm:text-3xl pt-3 pb-4 font-bold text-black dark:text-brandLight">
                <ul className="flex gap-2 mb-8">
                  <li className={`bg-brandDark w-full h-1 rounded-full`}></li>
                  <ul className="w-full flex">
                    <li className={`${step === "addAssets" || step === "generateOffer" || step === "getWalletsAgain" ? 'bg-brandDark' : 'bg-brandDark/10'} w-full h-1 rounded-l-full`}></li>
                    <li className={`${step === "getWalletsAgain" || step === "generateOffer" ? 'bg-brandDark' : 'bg-brandDark/10'} w-full h-1 rounded-r-full`}></li>
                  </ul>
                  <li className={`${step === "generateOffer" ? 'bg-brandDark' : 'bg-brandDark/10'} w-full h-1 rounded-full`}></li>
                </ul>
                
                {title}
              </Dialog.Title>

              {/* Wallet Options */}
              <div className="mt-4 flex flex-col gap-4">
                {fetchStep()}
              </div>
              </Dialog.Panel>
          </Transition.Child>
          </div>
      </div>
      </Dialog>
    </Transition>
    )
}

export default CompleteWithWalletModal;
