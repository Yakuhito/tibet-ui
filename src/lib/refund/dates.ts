/** Final LP snapshot: 14 Sep 2026, 12:00 Romania (EEST, UTC+3) = 09:00 UTC. */
export const SNAPSHOT_ISO = '2026-09-14T09:00:00.000Z';
export const SNAPSHOT_UTC_LABEL = '14 September 2026, 09:00 UTC';

/** Review ends / distribution starts: 16 Sep 2026, 12:00 Romania = 09:00 UTC. */
export const DISTRIBUTION_ISO = '2026-09-16T09:00:00.000Z';
export const DISTRIBUTION_UTC_LABEL = '16 September 2026, 09:00 UTC';

export const LOCAL_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short',
};

export function formatLocalInstant(iso: string, timeZone?: string): string {
  return new Intl.DateTimeFormat(undefined, {
    ...LOCAL_DATE_FORMAT,
    ...(timeZone ? { timeZone } : {}),
  }).format(new Date(iso));
}
