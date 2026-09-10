import { hexToBytes } from './hex';
import type { ChiaWalletSdkWasm } from './wasm';

export const WALLET_UNHARDENED_PATH_PREFIX = [12381, 8444, 2] as const;
export const DERIVE_BATCH_SIZE = 500;
export const COINSET_ACTIVITY_WINDOW = 32;

export type DerivedAddress = {
  address: string;
  puzzleHash: Uint8Array;
  publicKeyHex: string;
  index: number;
};

/**
 * Treat `publicKeyHex` as a master observer key and expand the Chia wallet
 * unhardened path m/12381/8444/2/i.
 *
 * WASM `standardPuzzleHash(syntheticKey)` curries the standard puzzle with the
 * key it is given — it does not apply the default hidden-puzzle offset. The
 * child must be `deriveSynthetic()` first (same as official wallet addresses).
 */
export function deriveUnhardenedWalletAddress(
  wasm: ChiaWalletSdkWasm,
  publicKeyHex: string,
  index: number,
): DerivedAddress {
  const master = wasm.PublicKey.fromBytes(hexToBytes(publicKeyHex));
  try {
    const child = master.deriveUnhardenedPath([...WALLET_UNHARDENED_PATH_PREFIX, index]);
    try {
      const synthetic = child.deriveSynthetic();
      try {
        const puzzleHash = wasm.standardPuzzleHash(synthetic);
        const addressObj = new wasm.Address(puzzleHash, 'xch');
        try {
          return {
            address: addressObj.encode(),
            puzzleHash,
            publicKeyHex,
            index,
          };
        } finally {
          addressObj.free();
        }
      } finally {
        synthetic.free();
      }
    } finally {
      child.free();
    }
  } finally {
    master.free();
  }
}

export function deriveUnhardenedWalletBatch(
  wasm: ChiaWalletSdkWasm,
  publicKeyHex: string,
  startIndex: number,
  count: number,
): DerivedAddress[] {
  const derived: DerivedAddress[] = [];
  const master = wasm.PublicKey.fromBytes(hexToBytes(publicKeyHex));
  try {
    for (let i = 0; i < count; i += 1) {
      const index = startIndex + i;
      const child = master.deriveUnhardenedPath([...WALLET_UNHARDENED_PATH_PREFIX, index]);
      try {
        const synthetic = child.deriveSynthetic();
        try {
          const puzzleHash = wasm.standardPuzzleHash(synthetic);
          const addressObj = new wasm.Address(puzzleHash, 'xch');
          try {
            derived.push({
              address: addressObj.encode(),
              puzzleHash,
              publicKeyHex,
              index,
            });
          } finally {
            addressObj.free();
          }
        } finally {
          synthetic.free();
        }
      } finally {
        child.free();
      }
    }
  } finally {
    master.free();
  }
  return derived;
}
