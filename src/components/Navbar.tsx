import ConnectButton from './walletIntegration/ConnectButton';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Navbar() {
  const router = useRouter();
  return (
    <header className="sticky w-full top-0 bg-brandLight/50 dark:bg-zinc-900/50 backdrop-blur-xl z-20 h-24">
      <div className="container mx-auto px-4 flex gap-4 sm:gap-8 items-center justify-between py-4">

        <Link href="/">
            <Image
              src="/logo.jpg"
              height="64"
              width="64"
              alt="TibetSwap Logo"
              className="rounded-full border-neutral-300 hover:translate-y-1 hover:opacity-80 transition dark:opacity-80"
            />
        </Link>

        <nav className="flex items-center rounded-xl p-1">
          <Link href="/" className={`font-medium text-brandDark px-6 py-1.5 rounded-xl ${router.asPath === "/" || router.pathname === "/[pair_short_name]" ? 'dark:text-brandLight bg-brandDark/10' : 'text-brandDark/70 dark:text-brandLight/50 hover:opacity-80'}`}>Trade</Link>
          <Link href="/faq" className={`font-medium text-brandDark px-6 py-1.5 rounded-xl ${router.asPath === "/faq" ? 'dark:text-brandLight bg-brandDark/10' : 'text-brandDark/70 dark:text-brandLight/50 hover:opacity-80'}`}>FAQs</Link>
          <Link href={`${process.env.NEXT_PUBLIC_INFO_BASE_URL}`} className="font-medium text-brandDark text-brandDark/70 dark:text-brandLight/50 px-6 py-1.5 rounded-xl hover:opacity-80">Stats</Link>
        </nav>
        
        <div className="hidden sm:block ml-auto">
          <ConnectButton />
        </div>

      </div>
    </header>
  );
};