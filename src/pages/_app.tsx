import { WalletContextProvider } from '@/context/WalletContext';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';
import Navbar from '@/components/Navbar';
import * as React from 'react';

import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {

  // Theme detector
  const [theme, setTheme] = useState<"dark" | "light" | "auto" | undefined>();
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

  const switchTheme = (newTheme: "dark" | "light" | "auto") => {
    switch (newTheme) {
      case "dark":
        localStorage.setItem('theme', 'dark')
        setTheme("dark")
        break;
      case "light":
        localStorage.setItem('theme', 'light')
        setTheme("light")
        break;
      default:
        localStorage.removeItem('theme')
        setTheme("auto")
        break;
    }
  };

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
          <footer className="pb-6 pt-12 text-center text-brandDark mt-auto mx-auto flex flex-col items-center">
                <p className="mb-2 flex items-center">Follow us on<a href="https://twitter.com/TibetSwap" target="_blank" rel="noopener noreferrer" className="underline ml-1"><svg xmlns="http://www.w3.org/2000/svg" className="fill-brandDark hover:opacity-80" viewBox="0 0 48 48" width="24px" height="24px"><path d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"/></svg></a></p>
                
                {/* Theme switcher */}
                <div className="flex items-center bg-brandDark/10 dark:bg-brandDark/20 rounded-xl p-1 scale-75">
                  <p onClick={() => switchTheme('auto')} className={`cursor-pointer font-medium px-4 py-1 rounded-lg ${theme === 'auto' ? `text-brandLight bg-brandDark` : 'text-brandDark dark:text-brandLight/50'}`}>Auto</p>
                  <svg onClick={() => switchTheme('light')} className={`cursor-pointer w-12 h-8 rounded-lg p-1.5 ${theme === 'light' ? `text-brandLight bg-brandDark` : 'text-brandDark dark:text-brandLight/50'}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                  <svg onClick={() => switchTheme('dark')} className={`cursor-pointer w-12 h-8 rounded-lg text-brandDark p-1.5 ${theme === 'dark' && `text-brandLight bg-brandDark`}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                </div>

          </footer>
        </div>
      </div>
    </WalletContextProvider>
  );
}
