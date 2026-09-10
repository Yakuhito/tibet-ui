export type DexieTokenMetadata = {
  status: 'ok' | 'missing' | 'unavailable';
  ticker: string | null;
  name: string | null;
  imageUrl: string | null;
  errorMessage?: string;
};

type FetchLike = typeof fetch;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function parseDexie(payload: unknown): DexieTokenMetadata {
  const root = asRecord(payload);
  if (!root) {
    return { status: 'unavailable', ticker: null, name: null, imageUrl: null, errorMessage: 'Unexpected Dexie response.' };
  }

  if (root.success === false) {
    return { status: 'missing', ticker: null, name: null, imageUrl: null };
  }

  const tokens = Array.isArray(root.tokens) ? root.tokens : null;
  const token = tokens?.[0] ? asRecord(tokens[0]) : asRecord(root.token) ?? asRecord(root);
  if (!token) {
    return { status: 'missing', ticker: null, name: null, imageUrl: null };
  }

  return {
    status: 'ok',
    ticker: asString(token.symbol) ?? asString(token.code) ?? asString(token.ticker),
    name: asString(token.name) ?? asString(token.full_name),
    imageUrl: asString(token.image_url) ?? asString(token.logo_url) ?? asString(token.icon),
  };
}

const metadataCache = new Map<string, Promise<DexieTokenMetadata>>();

export async function fetchDexieToken(
  assetId: string,
  fetchImpl: FetchLike = fetch,
): Promise<DexieTokenMetadata> {
  const cached = metadataCache.get(assetId);
  if (cached) {
    return cached;
  }

  const request = (async () => {
    try {
      const response = await fetchImpl(`https://api.dexie.space/v1/tokens?id=${assetId}`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return parseDexie(await response.json());
    } catch (error) {
      return {
        status: 'unavailable' as const,
        ticker: null,
        name: null,
        imageUrl: null,
        errorMessage: error instanceof Error ? error.message : 'Request failed.',
      };
    }
  })();

  metadataCache.set(assetId, request);
  return request;
}

export { parseDexie };
