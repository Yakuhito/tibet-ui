import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="application-name" content="TibetSwap" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TibetSwap" />
        <meta name="description" content="The AMM for the Chia blockchain." />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/logo.jpg" />
        <link rel="apple-touch-icon" sizes="400x400" href="/logo.jpg" />

        <link rel="icon" type="image/jpeg" sizes="400x400" href="/logo.jpg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/logo.jpg" />

        <meta name="twitter:card" content="TibetSwap v1: An AMM for the Chia blockchain." />
        <meta name="twitter:url" content="https://tibetswap.io" />
        <meta name="twitter:title" content="TibetSwap v1" />
        <meta name="twitter:description" content="TibetSwap v1: An AMM for the Chia blockchain." />
        <meta name="twitter:image" content="https://v1-testnet10.tibetswap.io/logo.jpg" />
        <meta name="twitter:creator" content="@yakuh1t0" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TibetSwap v1" />
        <meta property="og:description" content="TibetSwap v1: An AMM for the Chia blockchain." />
        <meta property="og:site_name" content="TibetSwap v1" />
        <meta property="og:url" content="https://tibetswap.io" />
        <meta property="og:image" content="https://v1-testnet10.tibetswap.io/logo.jpg" />

        <link rel='apple-touch-startup-image' href='/logo.jpg' sizes='400x400' />
      </Head>
      <body className="bg-slate-100 dark:bg-zinc-900 dark:text-brandLight">
        <div className="container mx-auto px-4">
          <Main />
        </div>
        <NextScript />
      </body>
    </Html>
  )
}
