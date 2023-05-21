import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';
import Navbar from '@/components/Navbar';
import { WalletContextProvider } from '@/context/WalletContext';
import * as React from 'react';

import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <WalletContextProvider>
      <div>
        <Navbar />
        <Toaster position="bottom-right"
          toastOptions={{
            success: {
              iconTheme: {
                primary: '#166534',
                secondary: '#EFF4F7'
              }
            },
            error: {
              iconTheme: {
                primary: '#B91C1C',
                secondary: '#EFF4F7'
              }
            }
          }} />
        <div className="min-h-[calc(100svh-96px)] flex flex-col px-4">
          <div className="pt-12">
            <Component {...pageProps}  />
          </div>
          <footer className="pb-6 pt-12 text-center text-brandDark mt-auto">
                <p>Follow us on<a href="https://twitter.com/TibetSwap" target="_blank" rel="noopener noreferrer" className="underline ml-1">Twitter</a></p>
          </footer>
        </div>
      </div>
    </WalletContextProvider>
  );
}
