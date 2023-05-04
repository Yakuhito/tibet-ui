import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-[100svh] flex flex-col">
      <Navbar />
      <div className="mx-auto">
        <Component {...pageProps} />
      </div>
      <footer className="pb-6 pt-1 text-center text-brandDark mt-auto">
        <p>
          Built with 💚 by the
          <a href="https://twitter.com/yakuh1t0" target="_blank" rel="noopener noreferrer"> yak </a>
          & GPT-4 | Powered by
          <a href="https://fireacademy.io" target="_blank" rel="noopener noreferrer" className="underline mx-1">FireAcademy.io</a>
          | Follow us on
          <a href="https://twitter.com/TibetSwap" target="_blank" rel="noopener noreferrer" className="underline ml-1">Twitter</a>
        </p>
      </footer>
    </div>
  );
}
