import { bech32m } from 'bech32';

import { isObserverPublicKeyHex, normalizeHex } from './hex';

export type ParsedRefundInput = {
  addresses: string[];
  publicKeys: string[];
  errors: string[];
};

const TOKEN_SPLIT = /[\s,;]+/;

function isTxchAddress(token: string): boolean {
  return token.toLowerCase().startsWith('txch');
}

function normalizeXchAddress(token: string): string | null {
  try {
    const decoded = bech32m.decode(token.toLowerCase());
    if (decoded.prefix !== 'xch') {
      return null;
    }
    const bytes = bech32m.fromWords(decoded.words);
    if (bytes.length !== 32) {
      return null;
    }
    return bech32m.encode('xch', decoded.words).toLowerCase();
  } catch {
    return null;
  }
}

export function parseRefundInput(raw: string): ParsedRefundInput {
  const tokens = raw.split(TOKEN_SPLIT).map((token) => token.trim()).filter(Boolean);
  const addresses: string[] = [];
  const publicKeys: string[] = [];
  const errors: string[] = [];
  const seenAddresses = new Set<string>();
  const seenKeys = new Set<string>();

  for (const token of tokens) {
    if (isTxchAddress(token)) {
      errors.push(`Testnet addresses are not supported: ${token}`);
      continue;
    }

    if (token.toLowerCase().startsWith('xch1')) {
      const address = normalizeXchAddress(token);
      if (!address) {
        errors.push(`Invalid xch address: ${token}`);
        continue;
      }
      if (!seenAddresses.has(address)) {
        seenAddresses.add(address);
        addresses.push(address);
      }
      continue;
    }

    if (isObserverPublicKeyHex(token)) {
      const key = normalizeHex(token);
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        publicKeys.push(key);
      }
      continue;
    }

    errors.push(`Unrecognized value (need an xch1 address or 48-byte observer key): ${token}`);
  }

  if (tokens.length === 0) {
    errors.push('Paste at least one xch1 address or observer public key.');
  }

  return { addresses, publicKeys, errors };
}
