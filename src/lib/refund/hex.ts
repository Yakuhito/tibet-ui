export function normalizeHex(value: string): string {
  return value.trim().toLowerCase().replace(/^0x/, '');
}

export function isObserverPublicKeyHex(value: string): boolean {
  const hex = normalizeHex(value);
  return hex.length === 96 && /^[0-9a-f]+$/.test(hex);
}

export function hexToBytes(hex: string): Uint8Array {
  const normalized = normalizeHex(hex);
  if (normalized.length === 0 || normalized.length % 2 !== 0) {
    throw new Error(`Invalid hex length ${normalized.length}.`);
  }
  if (!/^[0-9a-f]+$/.test(normalized)) {
    throw new Error('Value is not hex.');
  }
  const out = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
