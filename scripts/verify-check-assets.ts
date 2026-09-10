import { checkAssets } from '../src/lib/refund/checkAssets';
import { deriveUnhardenedWalletAddress } from '../src/lib/refund/derive';
import { parseRefundInput } from '../src/lib/refund/parseInput';
import { loadChiaWalletSdkWasm } from '../src/lib/refund/wasm';

const MASTER =
  'b2884f0eb69352b4dcf95d0c1dce053521104c1ccbe609826e2b55d1deae809ebcd3d0912f3d6f687561960526b5ea5d';
const INDEX0 = 'xch1g3hve3wtz0rswuat93cz4smmqt2u5nr5alhelj4rmpgngelzc9aszehtem';
const INDEX1 = 'xch1ah3stsckar2h424prl8nru3q6su0zj562d3q4sxmc4kxvu9mnceqpafky3';
const SAMPLE_CSV = 'xch1006r4ae0k0qjlxxgjrdsatyyeg0racwrzjaxh6ausj8m2v2glewq829z55';

async function main() {
  const wasm = await loadChiaWalletSdkWasm();
  const derived0 = deriveUnhardenedWalletAddress(wasm, MASTER, 0);
  const derived1 = deriveUnhardenedWalletAddress(wasm, MASTER, 1);
  if (derived0.address !== INDEX0 || derived1.address !== INDEX1) {
    throw new Error(`derive.ts fixture mismatch: ${derived0.address} ${derived1.address}`);
  }
  console.log('derive.ts fixture matched');

  const parsed = parseRefundInput(`${INDEX0}\n${INDEX1}\ntxch1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq`);
  if (!parsed.errors.some((error) => error.includes('Testnet'))) {
    throw new Error('Expected txch rejection');
  }
  if (!parsed.addresses.includes(INDEX0) || !parsed.addresses.includes(INDEX1)) {
    throw new Error('Valid xch1 tokens should still be kept when a txch line is present');
  }
  console.log('parseInput rejects txch but keeps valid xch1 tokens');

  const addressOnly = await checkAssets(`${INDEX0}\n${INDEX1}`, console.log);
  if (addressOnly.errors.length > 0) {
    throw new Error(addressOnly.errors.join('\n'));
  }
  if (addressOnly.lookedUpAddresses.length !== 2) {
    throw new Error(`Expected 2 looked-up addresses, got ${addressOnly.lookedUpAddresses.length}`);
  }
  if (addressOnly.groups.length !== 0) {
    throw new Error('Fixture addresses unexpectedly matched the snapshot');
  }
  console.log('address-only CSV lookup ran (empty snapshot match)');

  const sample = await checkAssets(SAMPLE_CSV, console.log);
  if (sample.errors.length > 0) {
    throw new Error(sample.errors.join('\n'));
  }
  if (sample.groups.length === 0) {
    throw new Error('Sample CSV address should have a refund row');
  }
  console.log(
    `sample CSV address matched ${sample.groups.length} asset(s):`,
    sample.groups.map((group) => `${group.assetId ?? 'xch'} ${group.amount}`).join(', '),
  );

  const catAddress = 'xch10al8ygak3nt6dq065dhywpyz3cqcnevjfphzsjdq6yfkfypwdzvsexrc8y';
  const cat = await checkAssets(catAddress, console.log);
  if (cat.errors.length > 0) {
    throw new Error(cat.errors.join('\n'));
  }
  const catGroup = cat.groups.find((group) => group.assetId === '00000000024e1fb9fc47c7ec72854c6a987c4cc99f6535a4caca6154220eeda5');
  if (!catGroup) {
    throw new Error(`Expected CAT row for ${catAddress}, got ${JSON.stringify(cat.groups, (_key, value) => typeof value === 'bigint' ? value.toString() : value)}`);
  }
  console.log(`CAT sample matched amount ${catGroup.amount} dexie=${catGroup.dexie?.status} ticker=${catGroup.dexie?.ticker}`);

  const mixed = await checkAssets(`${SAMPLE_CSV}\ntxch1notarealaddress`, console.log);
  if (!mixed.errors.some((error) => error.includes('Testnet'))) {
    throw new Error('Mixed paste should surface the txch error');
  }
  if (mixed.groups.length === 0) {
    throw new Error('Mixed paste should still look up the valid xch1 address');
  }
  console.log('mixed paste kept the valid address and surfaced the txch error');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
