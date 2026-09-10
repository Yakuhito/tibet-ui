const path = require('path');

/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  sw: 'service-worker.js',
  disableDevLogs: true,
})

module.exports = withPWA({
  reactStrictMode: true,
  transpilePackages: ['chia-wallet-sdk-wasm'],
  experimental: {
    esmExternals: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      // Allowlist `/` and `/check` only. `[^/.]+` skips static files (logo.jpg, etc.).
      // `/api/*` and `/_next/*` are excluded. `/` is not matched by `/:path`.
      {
        source: '/:path((?!check|api|_next)[^/.]+)',
        destination: '/',
        permanent: false,
      },
      {
        source: '/:path((?!check|api|_next)[^/.]+)/:rest+',
        destination: '/',
        permanent: false,
      },
    ];
  },
  webpack(config, { isServer, dev }) {
    config.output.webassemblyModuleFilename =
      isServer && !dev
        ? "../static/wasm/[modulehash].wasm"
        : "static/wasm/[modulehash].wasm";
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    config.resolve.alias = {
      ...config.resolve.alias,
      'chia-wallet-sdk-wasm': path.resolve(__dirname, 'chia-wallet-sdk-wasm/chia_wallet_sdk_wasm.js'),
    };

    return config;
  },
})
