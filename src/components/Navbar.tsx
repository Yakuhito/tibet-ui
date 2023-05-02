import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Navbar() {
  return (
    <nav className="sticky w-full top-0 bg-brandLight/50 dark:bg-zinc-900/50 backdrop-blur-xl">
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
        <div className="flex items-center bg-brandDark/10 dark:bg-brandDark/20 rounded-xl p-1">
          <Link href="/" className="font-medium text-brandLight px-4 py-1 bg-brandDark rounded-lg">Swap</Link>
          <Link href={`${process.env.NEXT_PUBLIC_INFO_BASE_URL}`} className="font-medium text-brandDark dark:text-brandLight/50 px-4 py-1">Analytics</Link>
        </div>
      </div>
    </nav>
  );
};