import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import TradeBar from './Tradebar';

interface TradeBarModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

function TradeBarModal({ isOpen, setIsOpen }: TradeBarModalProps) {
    const [isInputFocused, setInputFocused] = useState(false);


    return ( 
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={() => {setIsOpen(false); setInputFocused(false)}}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-brandDark/10 backdrop-blur-xl" />
            </Transition.Child>
    
            <div className="fixed inset-0 overflow-hidden mr-[10px]">
                <div className="flex justify-center p-4 text-center">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-100"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Panel className="w-full max-w-md">
                        <div className="hover:border-brandDark/10 bg-brandLight/70 dark:bg-brandDark/10 border-2 border-transparent mt-0 w-full transform text-left align-middle transition-all rounded-xl overflow-hidden" onFocus={() => setInputFocused(true)}>
                            <TradeBar isInputFocused={isInputFocused} />
                        </div>
                        <p className="w-full px-14 mx-0.5  text-brandDark py-4 text-sm font-mono">Press tab to auto-complete</p>
                    </Dialog.Panel>
                </Transition.Child>
                </div>
            </div>
            </Dialog>
        </Transition>
     );
}

export default TradeBarModal;