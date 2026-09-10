import { useEffect, useState } from 'react';

import { formatLocalInstant } from '@/lib/refund/dates';

type UtcLocalInstantProps = {
  iso: string;
  utcLabel: string;
  className?: string;
};

export default function UtcLocalInstant({ iso, utcLabel, className }: UtcLocalInstantProps) {
  const [local, setLocal] = useState<string | null>(null);

  useEffect(() => {
    setLocal(formatLocalInstant(iso));
  }, [iso]);

  return (
    <span
      className={`inline-block w-fit rounded-xl border border-brandDark/30 px-3 py-2 ${className ?? ''}`}
    >
      <span className="font-semibold">{utcLabel}</span>
      {local ? (
        <span className="block text-sm font-normal opacity-70">Local: {local}</span>
      ) : null}
    </span>
  );
}
