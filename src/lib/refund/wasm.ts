export type ChiaWalletSdkWasm = typeof import('chia-wallet-sdk-wasm');

let wasmPromise: Promise<ChiaWalletSdkWasm> | null = null;

/** Lazily load wallet-SDK WASM (browser / Node). */
export function loadChiaWalletSdkWasm(): Promise<ChiaWalletSdkWasm> {
  if (!wasmPromise) {
    wasmPromise = import('chia-wallet-sdk-wasm');
  }
  return wasmPromise;
}
