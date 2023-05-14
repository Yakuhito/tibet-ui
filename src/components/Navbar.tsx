import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Navbar() {
  const router = useRouter();
  return (
    <header className="sticky w-full top-0 bg-brandLight/50 dark:bg-zinc-900/50 backdrop-blur-xl z-20">
      <div className="container mx-auto px-4 flex gap-8 items-center justify-between py-4">

        <Link href="/">
            <Image
              src="/logo.jpg"
              height="64"
              width="64"
              alt="TibetSwap Logo"
              className="rounded-full border-neutral-300 hover:translate-y-1 hover:opacity-80 transition dark:opacity-80"
            />
        </Link>

        <nav className="flex items-center bg-brandDark/10 dark:bg-brandDark/20 rounded-xl p-1">
          <Link href="/" className={`font-medium text-brandDark px-4 py-1 rounded-lg ${router.asPath === "/" || router.pathname === "/[pair_short_name]" ? 'text-brandLight bg-brandDark' : 'dark:text-brandLight/50'}`}>Swap</Link>
          <Link href="/faq" className={`font-medium text-brandDark px-4 py-1 rounded-lg ${router.asPath === "/faq" ? 'text-brandLight bg-brandDark' : 'dark:text-brandLight/50'}`}>FAQ</Link>
          <Link href={`${process.env.NEXT_PUBLIC_INFO_BASE_URL}`} className="font-medium text-brandDark dark:text-brandLight/50 px-4 py-1">Analytics</Link>
        </nav>

      </div>
    </header>
  );
};