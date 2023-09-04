import { WalletContextProvider } from '@/context/WalletContext';
import TwitterIcon from '@/components/atomic/icons/TwitterIcon';
import { Analytics } from '@vercel/analytics/react';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';
import Navbar from '@/components/Navbar';
import * as React from 'react';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {

  // Theme detector
  const [theme, setTheme] = useState<"dark" | "light" | "auto">("auto");
  useEffect(() => {
    const detectTheme = () => {
      if (typeof window !== 'undefined') {
        if (localStorage.theme === 'dark') {
          document.documentElement.classList.add('dark');
          setTheme('dark');
        } else if (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
          setTheme('auto')
        } else if (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches) {
          document.documentElement.classList.remove('dark');
          setTheme('auto')
        } else {
          document.documentElement.classList.remove('dark');
          setTheme('light');
        }
      }
    }
    detectTheme()

    // Detect user preference change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectTheme);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', detectTheme);
    };

  }, [theme]);

  return (
    <WalletContextProvider>
      <div>
        <Navbar theme={theme} setTheme={setTheme} />
        <Toaster position="bottom-right"
          toastOptions={{
            loading: {
              duration: 45000,
            },
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
            <Analytics />
          </div>
          <footer className="pb-6 pt-12 mb-[76px] md:mb-0 text-center text-brandDark mt-auto mx-auto flex flex-col items-center">
            <a href="https://twitter.com/TibetSwap" target="_blank" rel="noopener noreferrer" className="underline ml-1">
              <TwitterIcon />
            </a>
          </footer>
        </div>
      </div>
    </WalletContextProvider>
  );
}