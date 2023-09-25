import { Dialog, Transition } from '@headlessui/react';
import { CSSProperties, ChangeEvent, Fragment, useState } from 'react';
import SearchIcon from '../icons/SearchIcon';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import type { Token } from '@/api';
import Image from 'next/image';

import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

interface TokenSelectorProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    setSelectedToken: (token: Token) => void;
}

function TokenSelectorModal({ isOpen, setIsOpen, setSelectedToken }: TokenSelectorProps) {

  const tokens = useSelector((state: RootState) => state.globalOnLoadData.tokens);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredTokens = tokens ? tokens.filter(token => {
    const searchableName = (`${token.name} ${token.short_name} ${token.asset_id}`).toLowerCase();
    return searchableName.includes(searchTerm.toLowerCase())
    }
  ) : null;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  const selectToken = (token: Token) => {
    setIsOpen(false);
    setSelectedToken(token);
    setSearchTerm("");
  }

  const tokenRow = ({ index, style }: { index: number, style: CSSProperties }) => {
    if (!filteredTokens) return <p>No tokens</p>
    const token = filteredTokens[index]
    return (
      <li
        key={token.asset_id}
        style={style}
        className="flex gap-6 max-h-full items-center select-none cursor-pointer group hover:bg-brandDark/0 px-4 py-2 rounded-lg"
        onClick={() => selectToken(token)}
      >
        <div className="w-10 h-10 rounded-full relative overflow-hidden">
          <Image className="absolute top-0 left-0 w-10 h-10 rounded-full animate-fadeIn z-10 bg-brandLight" src={token.image_url} width={100} height={100} alt={token.name} priority />
          <div className="w-full h-full rounded-full text-brandLight font-medium flex justify-center items-center bg-brandDark/20 backdrop-blur">{token.short_name.substring(0, 2)}</div>
        </div>
        <div className="group-hover:pl-0.5 transition-all pl-0">
          <p className="font-medium text-xl">{token.short_name}</p>
        </div>
      </li>
    )
  }

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

                    {/* Settings Options */}
                    <div className="flex flex-col max-h-full min-h-full">

                      {/* Search */}
                      <div className="relative w-full flex flex-col items-center">
                        {/* <SearchIcon className="h-6 absolute left-4" /> */}
                        <input type="text" placeholder="Search by token or asset ID" className="w-full bg-brandDark/10 px-4 py-2 rounded-xl focus:outline-none text-xl" onChange={handleSearchChange} />
                      </div>

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
                          {filteredTokens && (
                            <div className="absolute w-full h-full min-h-full max-h-full left-0 top-0">
                              <AutoSizer>
                                {({ height, width }) => (
                                  <List
                                    className="List"
                                    height={height}
                                    itemCount={filteredTokens.length}
                                    itemSize={68}
                                    width={width}
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