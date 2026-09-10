import { useSelector } from 'react-redux';
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import CogIcon from '../icons/CogIcon';
import Logo from '../icons/Logo';

import SettingsModal from './SettingsModal';

import { setIsOpen } from '@/redux/settingsModalSlice';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/hooks';

interface NavbarProps {
  theme: "dark" | "light" | "auto";
  setTheme: (theme: NavbarProps['theme']) => void;
}

function navLinkClass(active: boolean) {
  return `font-medium text-sm sm:text-base text-brandDark px-2 sm:px-6 py-1.5 rounded-xl whitespace-nowrap ${
    active
      ? 'dark:text-brandLight bg-brandDark/10'
      : 'text-brandDark/70 dark:text-brandLight/50 hover:opacity-80'
  }`;
}

export default function Navbar({ theme, setTheme }: NavbarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isSettingsModalOpen = useSelector((state: RootState) => state.settingsModal.isOpen);
  const setIsSettingsModalOpen = (value: boolean) => {
    dispatch(setIsOpen(value));
  }

  return (
    <>
      <header className="sticky w-full top-0 bg-brandLight/50 dark:bg-zinc-900/50 backdrop-blur-xl z-20 md:h-24">
        <div className="container mx-auto px-4 flex gap-4 sm:gap-8 items-center justify-between py-2 h-full">

          <Link href="/" className="aspect-square dark:bg-brandLight p-1 rounded-full w-12 md:w-16 md:h-16 dark:opacity-80 hover:translate-y-1 flex items-center justify-center transition">
            <Logo className="fill-brandDark max-w-full h-auto mt-1.5" />
          </Link>

          <nav className="flex items-center rounded-xl p-1 min-w-0">
            <Link href="/" className={navLinkClass(router.pathname === '/')}>Overview</Link>
            <Link href="/check" className={navLinkClass(router.pathname === '/check')}>Check your assets</Link>
          </nav>

          <CogIcon className="w-6 hover:rotate-45 ml-auto transition cursor-pointer fill-brandDark dark:fill-brandLight" onClick={() => dispatch(setIsOpen(true))} />
          <SettingsModal isOpen={isSettingsModalOpen} setIsOpen={setIsSettingsModalOpen} theme={theme} setTheme={setTheme} />

        </div>
      </header>
    </>
  );
};
