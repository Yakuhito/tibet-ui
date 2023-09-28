import { useAppDispatch, useAppSelector as useSelector } from '@/hooks';
import store, { persistor, type RootState } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import XIcon from '@/components/icons/XIcon';
import { Analytics } from '@vercel/analytics/react';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';
import Navbar from '@/components/Navbar';
import { Provider } from 'react-redux';
import '@/styles/globals.css';

import { detectWalletEvents } from '@/redux/walletSlice';
import { setDevFee } from '@/redux/devFeeSlice';

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

  // On page reload, wallet event listeners need to be re-established (i.e. if user disconnects from their wallet, the UI will update)
  store.dispatch(detectWalletEvents());

  // Only persist devFee if >= 0.3%
  const state = store.getState();
  const devFee = state.devFee.devFee;
  if (devFee <= 0.003) {
    store.dispatch(setDevFee(0.003));
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="min-h-screen relative">
          <Navbar theme={theme} setTheme={setTheme} />
          <Toaster position="bottom-right"
            toastOptions={{
              className: "!bg-brandLight/80 backdrop-blur w-full sm:w-auto !px-4 !py-3 !rounded-xl font-medium text-sm",
              loading: {
                duration: 45000,
                iconTheme: {
                  primary: "black",
                  secondary: "transparent"
                }
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
          <div className="flex flex-col px-4">
            <div className="pt-12 pb-[96px]">
              <Component {...pageProps}  />
              <Analytics />
            </div>
            <footer className="absolute bottom-0 w-full left-0 pb-6 pt-12 text-center text-brandDark mt-full mx-auto flex flex-col items-center">
              <a href="https://twitter.com/TibetSwap" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                <XIcon />
              </a>
            </footer>
          </div>
        </div>
      </PersistGate>
    </Provider>
  );
}