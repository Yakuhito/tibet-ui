import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import MenuIcon from '../icons/MenuIcon';
import CogIcon from '../icons/CogIcon';
import Logo from '../icons/Logo';

import ConnectButton from './walletIntegration/ConnectButton';
import MobileNavMenuModal from './MobileNavMenuModal';
import SettingsModal from './SettingsModal';

import { setIsOpen } from '@/redux/settingsModalSlice';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/hooks';




interface NavbarProps {
  theme: "dark" | "light" | "auto";
  setTheme: (theme: NavbarProps['theme']) => void;
}

export default function Navbar({ theme, setTheme }: NavbarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isSettingsModalOpen = useSelector((state: RootState) => state.settingsModal.isOpen);
  const setIsSettingsModalOpen = (value: boolean) => {
    dispatch(setIsOpen(value));
  }

  const [isMobileNavModalOpen, setIsMobileNavModalOpen] = useState(false);

  return (
    <>
      <header className="sticky w-full top-0 bg-brandLight/50 dark:bg-zinc-900/50 backdrop-blur-xl z-20 md:h-24">
        <div className="container mx-auto px-4 flex gap-4 sm:gap-8 items-center justify-between py-2 h-full">

          <Link href="/" className="aspect-square dark:bg-brandLight p-1 rounded-full w-12 md:w-16 md:h-16 dark:opacity-80 hover:translate-y-1 flex items-center justify-center transition">
            <Logo className="fill-brandDark max-w-full h-auto mt-1.5" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center rounded-xl p-1">
            <Link href="/" className={`font-medium text-brandDark px-6 py-1.5 rounded-xl ${router.asPath === "/" || router.pathname === "/[pair_short_name]" ? 'dark:text-brandLight bg-brandDark/10' : 'text-brandDark/70 dark:text-brandLight/50 hover:opacity-80'}`}>Trade</Link>
            <Link href="/deploy" className={`font-medium hidden lg:flex text-brandDark px-6 py-1.5 rounded-xl ${router.asPath === "/deploy" ? 'dark:text-brandLight bg-brandDark/10' : 'text-brandDark/70 dark:text-brandLight/50 hover:opacity-80'}`}>New Pair</Link>
            <Link href="/faq" className={`font-medium text-brandDark px-6 py-1.5 rounded-xl ${router.asPath === "/faq" ? 'dark:text-brandLight bg-brandDark/10' : 'text-brandDark/70 dark:text-brandLight/50 hover:opacity-80'}`}>FAQs</Link>
            <Link href="/analytics" className={`font-medium text-brandDark px-6 py-1.5 rounded-xl ${router.asPath === "/analytics" ? 'dark:text-brandLight bg-brandDark/10' : 'text-brandDark/70 dark:text-brandLight/50 hover:opacity-80'}`}>Analytics</Link>
          </nav>
          <CogIcon className="w-6 hover:rotate-45 ml-auto transition cursor-pointer fill-brandDark dark:fill-brandLight hidden sm:block" onClick={() => dispatch(setIsOpen(true))} />
          <SettingsModal isOpen={isSettingsModalOpen} setIsOpen={setIsSettingsModalOpen} theme={theme} setTheme={setTheme} />
          <div className="ml-auto sm:ml-0">
            <ConnectButton />
          </div>
          
          {/* Mobile Navigation */}
          <MenuIcon className="w-8 text-brandDark dark:text-brandLight cursor-pointer hover:opacity-80 sm:hidden" onClick={() => setIsMobileNavModalOpen(true)}  />
          <MobileNavMenuModal isOpen={isMobileNavModalOpen} setIsOpen={setIsMobileNavModalOpen} setIsSettingsModalOpen={setIsSettingsModalOpen} isSettingsModalOpen={isSettingsModalOpen} />
          
        </div>
      </header>
    </>
  );
};