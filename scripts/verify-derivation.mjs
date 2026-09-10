import { Address, PublicKey, fromHex, standardPuzzleHash } from 'chia-wallet-sdk-wasm';

const MASTER =
  'b2884f0eb69352b4dcf95d0c1dce053521104c1ccbe609826e2b55d1deae809ebcd3d0912f3d6f687561960526b5ea5d';

const EXPECTED = [
  'xch1g3hve3wtz0rswuat93cz4smmqt2u5nr5alhelj4rmpgngelzc9aszehtem',
  'xch1ah3stsckar2h424prl8nru3q6su0zj562d3q4sxmc4kxvu9mnceqpafky3',
];

const master = PublicKey.fromBytes(fromHex(MASTER));
let failed = 0;

for (let i = 0; i < EXPECTED.length; i += 1) {
  const child = master.deriveUnhardenedPath([12381, 8444, 2, i]);
  const synthetic = child.deriveSynthetic();
  const puzzleHash = standardPuzzleHash(synthetic);
  const address = new Address(puzzleHash, 'xch').encode();
  synthetic.free();
  const ok = address === EXPECTED[i];
  console.log(`index ${i}: ${address}${ok ? '' : ` (expected ${EXPECTED[i]})`}`);
  if (!ok) {
    failed += 1;
  }
  child.free();
}

master.free();

if (failed > 0) {
  console.error(`Derivation fixture failed (${failed} mismatch${failed === 1 ? '' : 'es'}).`);
  process.exit(1);
}

console.log('Derivation fixture matched.');
