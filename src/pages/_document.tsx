import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="application-name" content="TibetSwap" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TibetSwap" />
        <meta name="description" content="Unleash DeFi potential with TibetSwap DEX: Chia's first AMM exchange. Swap, provide liquidity, and farm yield easily. Start trading today!" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/logo.jpg" />
        <link rel="apple-touch-icon" sizes="400x400" href="/logo.jpg" />

        <link rel="icon" type="image/jpeg" sizes="400x400" href="/logo.jpg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/logo.jpg" />

        <meta name="twitter:card" content="TibetSwap V2: An AMM for the Chia blockchain." />
        <meta name="twitter:url" content="https://tibetswap.io" />
        <meta name="twitter:title" content="TibetSwap V2" />
        <meta name="twitter:description" content="TibetSwap V2: An AMM for the Chia blockchain." />
        <meta name="twitter:image" content="https://v2.tibetswap.io/logo.jpg" />
        <meta name="twitter:creator" content="@yakuh1t0" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TibetSwap V2" />
        <meta property="og:description" content="TibetSwap V2: An AMM for the Chia blockchain." />
        <meta property="og:site_name" content="TibetSwap V2" />
        <meta property="og:url" content="https://tibetswap.io" />
        <meta property="og:image" content="https://v2.tibetswap.io/logo.jpg" />

        <link rel='apple-touch-startup-image' href='/logo.jpg' sizes='400x400' />
      </Head>
      <body className="bg-slate-100 dark:bg-zinc-900 dark:text-brandLight">
        <div className="container mx-auto">
          <Main />
        </div>
        <NextScript />
      </body>
    </Html>
  )
}
