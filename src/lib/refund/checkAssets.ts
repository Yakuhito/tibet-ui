import { loadRefundsCsv, type RefundCsvIndex, type RefundCsvRow } from './csv';
import {
  DERIVE_BATCH_SIZE,
  DERIVE_INDEX_COUNT,
  deriveUnhardenedWalletBatch,
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

export type CheckProgressState = {
  message: string;
  groups: RefundAssetGroup[];
  lookedUpCount: number;
};

export type CheckProgress = (state: CheckProgressState) => void;

export type CheckAssetsOptions = {
  deriveIndexCount?: number;
  deriveBatchSize?: number;
};

type GroupAccumulator = Map<string, { assetId: string | null; amount: bigint; addresses: Set<string> }>;

function addRows(grouped: GroupAccumulator, rows: RefundCsvRow[]): void {
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
}

function matchAddresses(
  addresses: string[],
  csv: RefundCsvIndex,
  grouped: GroupAccumulator,
): void {
  for (const address of addresses) {
    const rows = csv.get(address);
    if (rows) {
      addRows(grouped, rows);
    }
  }
}

async function materializeGroups(grouped: GroupAccumulator): Promise<RefundAssetGroup[]> {
  return Promise.all(
    [...grouped.entries()]
      .sort(([a], [b]) => {
        if (a === 'xch') return -1;
        if (b === 'xch') return 1;
        return a.localeCompare(b);
      })
      .map(async ([, group]) => ({
        assetId: group.assetId,
        amount: group.amount,
        addresses: [...group.addresses].sort(),
        dexie: group.assetId ? await fetchDexieToken(group.assetId) : null,
      })),
  );
}

function yieldToUi(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

function derivationProgress(done: number, total: number): string {
  return `Loading - derived ${done} out of ${total} addresses`;
}

export async function checkAssets(
  rawInput: string,
  onProgress: CheckProgress = () => {},
  options: CheckAssetsOptions = {},
): Promise<CheckAssetsResult> {
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

  const deriveIndexCount = options.deriveIndexCount ?? DERIVE_INDEX_COUNT;
  const deriveBatchSize = options.deriveBatchSize ?? DERIVE_BATCH_SIZE;
  const addressSet = new Set(parsed.addresses.map((address) => address.toLowerCase()));
  const grouped: GroupAccumulator = new Map();

  const csvPromise = loadRefundsCsv();
  const wasmPromise = parsed.publicKeys.length > 0 ? loadChiaWalletSdkWasm() : null;
  const csv = await csvPromise;

  matchAddresses([...addressSet], csv, grouped);

  const emit = async (message: string): Promise<RefundAssetGroup[]> => {
    const groups = await materializeGroups(grouped);
    onProgress({
      message,
      groups,
      lookedUpCount: addressSet.size,
    });
    await yieldToUi();
    return groups;
  };

  if (wasmPromise) {
    const wasm = await wasmPromise;
    const total = parsed.publicKeys.length * deriveIndexCount;
    let done = 0;
    await emit(derivationProgress(done, total));

    for (let start = 0; start < deriveIndexCount; start += deriveBatchSize) {
      const count = Math.min(deriveBatchSize, deriveIndexCount - start);
      for (const publicKey of parsed.publicKeys) {
        const batch = deriveUnhardenedWalletBatch(wasm, publicKey, start, count);
        const fresh: string[] = [];
        for (const item of batch) {
          const address = item.address.toLowerCase();
          if (!addressSet.has(address)) {
            addressSet.add(address);
            fresh.push(address);
          }
        }
        matchAddresses(fresh, csv, grouped);
        done += batch.length;
        await emit(derivationProgress(done, total));
      }
    }
  } else {
    await emit('Matching the final snapshot…');
  }

  const groups = await materializeGroups(grouped);
  return { groups, lookedUpAddresses: [...addressSet], errors: parsed.errors };
}
