import { puzzleHashesAreActive } from './coinset';
import { loadRefundsCsv, type RefundCsvRow } from './csv';
import {
  COINSET_ACTIVITY_WINDOW,
  DERIVE_BATCH_SIZE,
  deriveUnhardenedWalletBatch,
  type DerivedAddress,
} from './derive';
import { fetchDexieToken, type DexieTokenMetadata } from './dexie';
import { parseRefundInput } from './parseInput';
import { loadChiaWalletSdkWasm } from './wasm';

export type RefundAssetGroup = {
  assetId: string | null;
  amount: bigint;
  addresses: string[];
  dexie: DexieTokenMetadata | null;
};

export type CheckAssetsResult = {
  groups: RefundAssetGroup[];
  lookedUpAddresses: string[];
  errors: string[];
};

export type CheckProgress = (message: string) => void;

function collectRows(addresses: string[], rowsFor: (address: string) => RefundCsvRow[] | undefined): RefundCsvRow[] {
  const matched: RefundCsvRow[] = [];
  for (const address of addresses) {
    const rows = rowsFor(address.toLowerCase());
    if (rows) {
      matched.push(...rows);
    }
  }
  return matched;
}

function groupRows(rows: RefundCsvRow[]): Map<string, { assetId: string | null; amount: bigint; addresses: Set<string> }> {
  const grouped = new Map<string, { assetId: string | null; amount: bigint; addresses: Set<string> }>();
  for (const row of rows) {
    const assetId = row.asset === '' ? null : row.asset;
    const key = assetId ?? 'xch';
    const existing = grouped.get(key);
    if (existing) {
      existing.amount += row.amount;
      existing.addresses.add(row.address);
    } else {
      grouped.set(key, { assetId, amount: row.amount, addresses: new Set([row.address]) });
    }
  }
  return grouped;
}

async function expandPublicKey(
  publicKeyHex: string,
  onProgress: CheckProgress,
): Promise<DerivedAddress[]> {
  const wasm = await loadChiaWalletSdkWasm();
  const derived: DerivedAddress[] = [];

  for (let start = 0; ; start += DERIVE_BATCH_SIZE) {
    const end = start + DERIVE_BATCH_SIZE - 1;
    onProgress(`Deriving addresses ${start}–${end}…`);
    const batch = deriveUnhardenedWalletBatch(wasm, publicKeyHex, start, DERIVE_BATCH_SIZE);
    derived.push(...batch);

    onProgress('Checking Coinset…');
    const window = batch.slice(-COINSET_ACTIVITY_WINDOW);
    const active = await puzzleHashesAreActive(window.map((item) => item.puzzleHash));
    if (!active) {
      break;
    }
  }

  return derived;
}

export async function checkAssets(rawInput: string, onProgress: CheckProgress = () => {}): Promise<CheckAssetsResult> {
  const parsed = parseRefundInput(rawInput);
  if (parsed.addresses.length === 0 && parsed.publicKeys.length === 0) {
    return {
      groups: [],
      lookedUpAddresses: [],
      errors: parsed.errors.length > 0
        ? parsed.errors
        : ['Paste at least one xch1 address or observer public key.'],
    };
  }

  const addressSet = new Set(parsed.addresses.map((address) => address.toLowerCase()));

  for (const publicKey of parsed.publicKeys) {
    const derived = await expandPublicKey(publicKey, onProgress);
    for (const item of derived) {
      addressSet.add(item.address.toLowerCase());
    }
  }

  const lookedUpAddresses = [...addressSet];
  onProgress('Matching snapshot…');
  const csv = await loadRefundsCsv();
  const rows = collectRows(lookedUpAddresses, (address) => csv.get(address));
  const grouped = groupRows(rows);

  const groups = await Promise.all(
    [...grouped.entries()]
      .sort(([a], [b]) => {
        if (a === 'xch') return -1;
        if (b === 'xch') return 1;
        return a.localeCompare(b);
      })
      .map(async ([, group]) => {
        const dexie = group.assetId ? await fetchDexieToken(group.assetId) : null;
        return {
          assetId: group.assetId,
          amount: group.amount,
          addresses: [...group.addresses].sort(),
          dexie,
        };
      }),
  );

  return { groups, lookedUpAddresses, errors: parsed.errors };
}
