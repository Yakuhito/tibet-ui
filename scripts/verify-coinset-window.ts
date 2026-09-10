import { puzzleHashesAreActive } from '../src/lib/refund/coinset';
import { deriveUnhardenedWalletAddress } from '../src/lib/refund/derive';
import { loadChiaWalletSdkWasm } from '../src/lib/refund/wasm';

const MASTER =
  'b2884f0eb69352b4dcf95d0c1dce053521104c1ccbe609826e2b55d1deae809ebcd3d0912f3d6f687561960526b5ea5d';

async function main() {
  const wasm = await loadChiaWalletSdkWasm();
  const first = deriveUnhardenedWalletAddress(wasm, MASTER, 0);
  const second = deriveUnhardenedWalletAddress(wasm, MASTER, 1);
  const active = await puzzleHashesAreActive([first.puzzleHash, second.puzzleHash]);
  console.log(`Coinset activity for fixture indexes 0–1: ${active ? 'active' : 'inactive'}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
