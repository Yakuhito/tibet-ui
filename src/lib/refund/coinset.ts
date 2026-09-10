import { bytesToHex } from './hex';
import { loadChiaWalletSdkWasm } from './wasm';

export const COINSET_ORIGIN = 'https://api.coinset.org';

type CoinsetEndpoint = 'get_coin_records_by_hints' | 'get_coin_records_by_puzzle_hashes';

type CoinsetPage = {
  success: boolean;
  error?: string;
  coinRecords: unknown[];
  truncated?: boolean;
  nextCursor?: string;
};

type CoinsetTransport = 'wasm' | 'fetch' | 'proxy';

let transport: CoinsetTransport | 'unknown' = 'unknown';
let wasmClient: InstanceType<Awaited<ReturnType<typeof loadChiaWalletSdkWasm>>['RpcClient']> | null = null;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function parseFetchPage(payload: unknown): CoinsetPage {
  const root = asRecord(payload);
  if (!root) {
    throw new Error('Unexpected Coinset response.');
  }
  const records = Array.isArray(root.coin_records)
    ? root.coin_records
    : Array.isArray(root.coinRecords)
      ? root.coinRecords
      : [];
  const nextCursor =
    typeof root.next_cursor === 'string'
      ? root.next_cursor
      : typeof root.nextCursor === 'string'
        ? root.nextCursor
        : undefined;
  return {
    success: root.success !== false,
    error: typeof root.error === 'string' ? root.error : undefined,
    coinRecords: records,
    truncated: Boolean(root.truncated),
    nextCursor,
  };
}

async function postJson(url: string, body: unknown): Promise<unknown> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Coinset HTTP ${response.status}`);
  }
  return response.json();
}

function hexHashes(puzzleHashes: Uint8Array[]): string[] {
  return puzzleHashes.map((bytes) => `0x${bytesToHex(bytes)}`);
}

async function pageUntilRecords(fetchPage: (cursor?: string) => Promise<CoinsetPage>): Promise<boolean> {
  let cursor: string | undefined;
  for (;;) {
    const page = await fetchPage(cursor);
    if (!page.success) {
      throw new Error(page.error || 'Coinset request failed');
    }
    if (page.coinRecords.length > 0) {
      return true;
    }
    if (page.truncated || page.nextCursor) {
      if (!page.nextCursor) {
        throw new Error('Coinset response was truncated without a next cursor');
      }
      cursor = page.nextCursor;
      continue;
    }
    return false;
  }
}

async function wasmPage(
  endpoint: CoinsetEndpoint,
  puzzleHashes: Uint8Array[],
  cursor?: string,
): Promise<CoinsetPage> {
  if (!wasmClient) {
    const wasm = await loadChiaWalletSdkWasm();
    wasmClient = new wasm.RpcClient(COINSET_ORIGIN);
  }
  const response = endpoint === 'get_coin_records_by_hints'
    ? await wasmClient.getCoinRecordsByHints(puzzleHashes, undefined, undefined, true, cursor)
    : await wasmClient.getCoinRecordsByPuzzleHashes(puzzleHashes, undefined, undefined, true, cursor);
  return {
    success: response.success,
    error: response.error,
    coinRecords: response.coinRecords ?? [],
    truncated: response.truncated,
    nextCursor: response.nextCursor,
  };
}

async function fetchPage(
  endpoint: CoinsetEndpoint,
  puzzleHashes: Uint8Array[],
  cursor?: string,
  viaProxy = false,
): Promise<CoinsetPage> {
  const field = endpoint === 'get_coin_records_by_hints' ? 'hints' : 'puzzle_hashes';
  const payload: Record<string, unknown> = {
    [field]: hexHashes(puzzleHashes),
    include_spent_coins: true,
  };
  if (cursor) {
    payload.cursor = cursor;
  }

  if (viaProxy) {
    const proxied = await postJson('/api/coinset', { endpoint, payload });
    return parseFetchPage(proxied);
  }
  return parseFetchPage(await postJson(`${COINSET_ORIGIN}/${endpoint}`, payload));
}

async function tryTransport(
  next: CoinsetTransport,
  endpoint: CoinsetEndpoint,
  puzzleHashes: Uint8Array[],
  cursor?: string,
): Promise<CoinsetPage> {
  if (next === 'wasm') {
    return wasmPage(endpoint, puzzleHashes, cursor);
  }
  if (next === 'fetch') {
    return fetchPage(endpoint, puzzleHashes, cursor, false);
  }
  return fetchPage(endpoint, puzzleHashes, cursor, true);
}

const TRANSPORT_ORDER: CoinsetTransport[] = ['wasm', 'fetch', 'proxy'];

async function pageWithFallback(endpoint: CoinsetEndpoint, puzzleHashes: Uint8Array[]): Promise<boolean> {
  const startAt = transport === 'unknown' ? 0 : TRANSPORT_ORDER.indexOf(transport);
  const order = TRANSPORT_ORDER.slice(startAt);
  let lastError: unknown;

  for (const candidate of order) {
    try {
      const hit = await pageUntilRecords((cursor) => tryTransport(candidate, endpoint, puzzleHashes, cursor));
      transport = candidate;
      return hit;
    } catch (error) {
      lastError = error;
      wasmClient = null;
      if (candidate === transport) {
        transport = 'unknown';
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('All Coinset transports failed');
}

/**
 * A set of puzzle hashes is inactive only if both hint and puzzle-hash
 * lookups return no records (paging while truncated or next_cursor is set).
 */
export async function puzzleHashesAreActive(puzzleHashes: Uint8Array[]): Promise<boolean> {
  if (puzzleHashes.length === 0) {
    return false;
  }
  if (await pageWithFallback('get_coin_records_by_hints', puzzleHashes)) {
    return true;
  }
  return pageWithFallback('get_coin_records_by_puzzle_hashes', puzzleHashes);
}
