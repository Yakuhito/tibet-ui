import ConnectButton from './walletIntegration/ConnectButton';
import { setIsOpen } from '@/redux/settingsModalSlice';
import SettingsModal from './modals/SettingsModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/hooks';
import { useRouter } from 'next/router';
import CogIcon from './icons/CogIcon';
import Logo from './icons/Logo';
import Link from 'next/link';
import React from 'react';

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

  return (
    <>
      <header className="sticky w-full top-0 bg-brandLight/50 dark:bg-zinc-900/50 backdrop-blur-xl z-20 md:h-24">
        <div className="container mx-auto px-4 flex gap-4 sm:gap-8 items-center justify-between py-4 h-full">

          <Link href="/" className="aspect-square dark:bg-brandLight p-1 rounded-full w-12 md:w-16 md:h-16 dark:opacity-80 hover:translate-y-1 flex items-center justify-center transition">
            <Logo className="fill-brandDark max-w-full h-auto mt-1.5" />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center rounded-xl p-1">
            <Link href="/" className={`font-medium text-brandDark px-6 py-1.5 rounded-xl ${router.asPath === "/" || router.pathname === "/[pair_short_name]" ? 'dark:text-brandLight bg-brandDark/10' : 'text-brandDark/70 dark:text-brandLight/50 hover:opacity-80'}`}>Trade</Link>
            <Link href="/faq" className={`font-medium text-brandDark px-6 py-1.5 rounded-xl ${router.asPath === "/faq" ? 'dark:text-brandLight bg-brandDark/10' : 'text-brandDark/70 dark:text-brandLight/50 hover:opacity-80'}`}>FAQs</Link>
            <Link href={`${process.env.NEXT_PUBLIC_INFO_BASE_URL}`} className="font-medium text-brandDark text-brandDark/70 dark:text-brandLight/50 px-6 py-1.5 rounded-xl hover:opacity-80">Stats</Link>
          </nav>
          <CogIcon onClick={() => dispatch(setIsOpen(true))} />
          <SettingsModal isOpen={isSettingsModalOpen} setIsOpen={setIsSettingsModalOpen} theme={theme} setTheme={setTheme} />
          <div className="hidden sm:block ">
            <ConnectButton />
          </div>

        </div>
      </header>

      {/* <header className="md:hidden fixed bottom-0 left-0 w-full bg-brandLight/50 dark:bg-zinc-900/50 backdrop-blur-xl z-20 p-4">
        <nav className="flex items-center rounded-xl p-1 w-full text-center">
            <Link href="/" className={`w-full font-medium text-brandDark px-6 py-1.5 rounded-xl ${router.asPath === "/" || router.pathname === "/[pair_short_name]" ? 'dark:text-brandLight bg-brandDark/10' : 'text-brandDark/70 dark:text-brandLight/50 hover:opacity-80'}`}>Trade</Link>
            <Link href="/faq" className={`w-full font-medium text-brandDark px-6 py-1.5 rounded-xl ${router.asPath === "/faq" ? 'dark:text-brandLight bg-brandDark/10' : 'text-brandDark/70 dark:text-brandLight/50 hover:opacity-80'}`}>FAQs</Link>
            <Link href={`${process.env.NEXT_PUBLIC_INFO_BASE_URL}`} className="w-full font-medium text-brandDark text-brandDark/70 dark:text-brandLight/50 px-6 py-1.5 rounded-xl hover:opacity-80">Stats</Link>
        </nav>
      </header> */}
    </>
  );
};