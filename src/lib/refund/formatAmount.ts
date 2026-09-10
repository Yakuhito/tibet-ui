const XCH_DECIMALS = 12;
const CAT_DECIMALS = 3;

function formatUnits(amount: bigint, decimals: number, trimTrailingZeros: boolean): string {
  const negative = amount < 0n;
  const abs = negative ? -amount : amount;
  const base = 10n ** BigInt(decimals);
  const whole = abs / base;
  let frac = (abs % base).toString().padStart(decimals, '0');
  if (trimTrailingZeros) {
    frac = frac.replace(/0+$/, '');
  }
  const sign = negative ? '-' : '';
  return frac.length > 0 ? `${sign}${whole}.${frac}` : `${sign}${whole.toString()}`;
}

export function formatXchAmount(mojos: bigint): string {
  return formatUnits(mojos, XCH_DECIMALS, true);
}

/** CAT / LP amounts are always divided by 1000 and shown to 3 decimals. */
export function formatCatAmount(raw: bigint): string {
  return formatUnits(raw, CAT_DECIMALS, false);
}
