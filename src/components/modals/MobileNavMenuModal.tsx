import { Dialog, Transition } from '@headlessui/react';
import CrossIcon from '../icons/CrossIcon';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import Link from 'next/link';

interface MobileNavMenuModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

function MobileNavMenuModal({ isOpen, setIsOpen }: MobileNavMenuModalProps) {
  const router = useRouter();
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

                {/* <Dialog.Title as="h3" className="text-[2.5rem] sm:text-5xl pt-4 pb-4 md:pb-8 font-bold text-black dark:text-brandLight">Menu</Dialog.Title> */}
                
                <CrossIcon onClick={() => setIsOpen(false)} className="w-8 h-8 fill-brandDark cursor-pointer ml-auto -mr-2 hover:opacity-80 dark:fill-brandLight" />

                {/* Menu Options */}
                <div className="flex flex-col max-h-full">

                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-500"
                    enterFrom="translate-y-10 blur"
                    enterTo="translate-y-0 blur-none"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 blur"
                    leaveTo="opacity-0 translate-y-10 blur"
                  >
                    <ul className="flex flex-col text-5xl font-bold gap-4">
                      <li className={`${router.asPath === "/" ? 'text-brandDark' : ''} hover:pl-1 hover:text-brandDark transition-all`} onClick={() => setIsOpen(false)}><Link className="focus:outline-none" href="/">Trade</Link></li>
                      <li className={`${router.asPath === "/faq" ? 'text-brandDark' : ''} hover:pl-1 hover:text-brandDark transition-all`} onClick={() => setIsOpen(false)}><Link className="focus:outline-none" href="/faq">FAQ</Link></li>
                      <li className={`${router.asPath === "/info" ? 'text-brandDark' : ''} hover:pl-1 hover:text-brandDark transition-all`} onClick={() => setIsOpen(false)}><Link className="focus:outline-none" href="https://info.v2.tibetswap.io/">Info</Link></li>
                    </ul>
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

export default MobileNavMenuModal;