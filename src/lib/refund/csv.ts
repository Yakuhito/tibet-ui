export const REFUNDS_CSV_URL =
  'https://gist.githubusercontent.com/Yakuhito/f488dae7f2de01480ca7f02eb1f81985/raw/1744262fc4672330eb19184d5a31d1baad61d368/refunds_9210000.csv';

export type RefundCsvRow = {
  asset: string;
  address: string;
  amount: bigint;
};

export type RefundCsvIndex = Map<string, RefundCsvRow[]>;

let csvPromise: Promise<RefundCsvIndex> | null = null;

function parseCsvLine(line: string): RefundCsvRow | null {
  const first = line.indexOf(',');
  const last = line.lastIndexOf(',');
  if (first === -1 || last === -1 || first === last) {
    return null;
  }
  const asset = line.slice(0, first).trim().toLowerCase();
  const address = line.slice(first + 1, last).trim().toLowerCase();
  const amountRaw = line.slice(last + 1).trim();
  if (!address.startsWith('xch1') || !/^[0-9]+$/.test(amountRaw)) {
    return null;
  }
  return { asset, address, amount: BigInt(amountRaw) };
}

export function parseRefundsCsv(text: string): RefundCsvIndex {
  const index: RefundCsvIndex = new Map();
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]?.trim();
    if (!line || (i === 0 && line.toLowerCase().startsWith('asset,'))) {
      continue;
    }
    const row = parseCsvLine(line);
    if (!row) {
      continue;
    }
    const existing = index.get(row.address);
    if (existing) {
      existing.push(row);
    } else {
      index.set(row.address, [row]);
    }
  }
  return index;
}

async function fetchRefundsCsvText(): Promise<string> {
  try {
    const response = await fetch(REFUNDS_CSV_URL);
    if (!response.ok) {
      throw new Error(`Refunds CSV HTTP ${response.status}`);
    }
    return response.text();
  } catch (directError) {
    const proxied = await fetch('/api/refunds-csv');
    if (!proxied.ok) {
      throw directError instanceof Error ? directError : new Error('Failed to load refunds CSV');
    }
    return proxied.text();
  }
}

export function loadRefundsCsv(): Promise<RefundCsvIndex> {
  if (!csvPromise) {
    csvPromise = fetchRefundsCsvText().then(parseRefundsCsv);
  }
  return csvPromise;
}
