import { CSSProperties, ChangeEvent, Fragment, forwardRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useSelector } from 'react-redux';
import Image from 'next/image';

import CrossIcon from '../icons/CrossIcon';

import { RootState } from '@/redux/store';
import type { Pair } from '@/api';
import { setDevFee } from '@/redux/devFeeSlice';
import { useAppDispatch } from '@/hooks';



interface TokenSelectorProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    setSelectedPair: (pair: Pair) => void;
}

function TokenSelectorModal({ isOpen, setIsOpen, setSelectedPair }: TokenSelectorProps) {
  const dispatch = useAppDispatch();
  const pairs = useSelector((state: RootState) => state.globalOnLoadData.pairs);
  const devFee = useSelector((state: RootState) => state.devFee.devFee);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredPairs = pairs ? pairs.filter(pair => {
    const searchableName = (`${pair.asset_name} ${pair.asset_short_name} ${pair.asset_id}`).toLowerCase();
    return searchableName.includes(searchTerm.toLowerCase())
    }
  ) : null;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  const selectPair = (pair: Pair) => {
    setIsOpen(false);
    setSelectedPair(pair);
    setSearchTerm("");
  }

  const tokenRow = ({ index, style }: { index: number, style: CSSProperties }) => {
    if (!filteredPairs) return <p>No pairs</p>
    const pair = filteredPairs[index]
    return (
      <li
        key={pair.pair_id}
        style={{
          ...style,
          top: `${parseFloat(`${style.top}`) + 32}px`
        }}
        className="flex gap-6 max-h-full items-center select-none cursor-pointer group hover:bg-brandDark/0 px-4 py-2 rounded-lg"
        onClick={() => selectPair(pair)}
      >
        <div className="w-10 h-10 rounded-full relative overflow-hidden">
          <Image className="absolute top-0 left-0 w-10 h-10 rounded-full animate-fadeIn z-10 bg-brandLight" src={pair.asset_image_url} width={100} height={100} alt={pair.asset_name} priority />
          <div className="w-full h-full rounded-full text-brandLight font-medium flex justify-center items-center bg-brandDark/20 backdrop-blur">{pair.asset_short_name.substring(0, 2)}</div>
        </div>
        <div className="group-hover:pl-0.5 transition-all pl-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-xl">{pair.asset_short_name}</p>
            {!pair.asset_verified && <p className="text-brandLight bg-red-700 text-sm rounded-full px-3 font-medium" title="This token is not verified">Unverified</p>}
          </div>
          <p className="text-gray-500 text-sm">{pair.asset_hidden_puzzle_hash === null ? 'XCH-CAT':'XCH-rCAT'} · {((1000 - pair.inverse_fee) / 10.0).toFixed(2) + '%'}</p>
        </div>
      </li>
    )
  }

  const innerElementType = forwardRef(function ({ style, ...rest }: { style: CSSProperties }, ref: React.Ref<HTMLDivElement>) {
    return (
      <div
        ref={ref}
        style={{
          ...style,
          height: `${parseFloat(`${style.height}`) + 32 * 2}px`
        }}
        {...rest}
      />
    )

  })
  innerElementType.displayName = "InnerElementType";

  
  return (    
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={() => setIsOpen(false)}>
        <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="bg-white/20"
            enterTo="bg-white/80"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
          <div className="fixed inset-0 dark:bg-zinc-900/90 backdrop-blur" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full h-full items-center justify-center p-4 pb-0 text-center">
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Dialog.Panel className="w-full max-w-md h-full transform overflow-hidden rounded-2xl p-2 text-left align-middle transition-all">

                <Dialog.Title as="h3" className="text-[2.5rem] sm:text-5xl pt-4 pb-4 md:pb-8 font-bold text-black dark:text-brandLight">Select a token</Dialog.Title>
                <div className="bg-brandDark/10 w-10 h-10 rounded-full flex justify-center items-center absolute top-8 right-4 cursor-pointer hover:opacity-80" onClick={() => setIsOpen(false)}>
                  <CrossIcon className="fill-black dark:fill-brandLight h-4 w-4" />
                </div>

                {/* Main Content Container */}
                <div className="flex flex-col max-h-full min-h-full">

                  {/* Search */}
                  <input type="text" placeholder="Search by token or asset ID" className="w-full bg-brandDark/10 px-4 py-2 rounded-xl focus:outline-none text-xl" onChange={handleSearchChange} />

                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-500"
                    enterFrom="translate-y-10 blur"
                    enterTo="translate-y-0 blur-none"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 blur"
                    leaveTo="opacity-0 translate-y-10 blur"
                  >
                    <div className="relative h-[calc(100svh-164px)]">
                      {/* Loading state or if no tokens available */}
                      {!pairs && (
                        <ul className="py-8">
                          <li className="flex gap-6 max-h-full items-center select-none cursor-pointer group hover:bg-brandDark/0 px-4 py-2 rounded-lg">
                              <div className="w-10 h-10 aspect-square rounded-full flex justify-center bg-brandDark/20 backdrop-blur animate-pulse"></div>
                              <div className="flex w-full h-8 bg-brandDark/10 rounded-full animate-pulse"></div>
                          </li>
                        </ul>
                      )}
                      {filteredPairs && (
                        <div className="absolute w-full h-full min-h-full max-h-full left-0 top-0">
                          <AutoSizer>
                            {({ height, width }: {height: number, width: number}) => (
                              <List
                                className="List"
                                height={height ? height : 0}
                                itemCount={filteredPairs.length}
                                itemSize={68}
                                width={width ? width : 0}
                                innerElementType={innerElementType}
                              >
                                {tokenRow}
                              </List>
                            )}
                          </AutoSizer>
                        </div>
                      )}
                    </div>

                  </Transition.Child>

                </div>
                </Dialog.Panel>
            </Transition.Child>
            </div>
        </div>
        </Dialog>
    </Transition>
  );
}

export default TokenSelectorModal;