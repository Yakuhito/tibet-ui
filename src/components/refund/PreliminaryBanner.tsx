import UtcLocalInstant from './UtcLocalInstant';

import {
  DISTRIBUTION_ISO,
  DISTRIBUTION_UTC_LABEL,
  SNAPSHOT_ISO,
  SNAPSHOT_UTC_LABEL,
} from '@/lib/refund/dates';

export default function PreliminaryBanner() {
  return (
    <div className="bg-brandDark/10 rounded-xl px-4 py-4 space-y-3 leading-relaxed">
      <p>
        Preliminary snapshot - only accurate if you have not moved your LP tokens. For the final snapshot, re-check from
      </p>
      <UtcLocalInstant iso={SNAPSHOT_ISO} utcLabel={SNAPSHOT_UTC_LABEL} />
      <p>through</p>
      <UtcLocalInstant iso={DISTRIBUTION_ISO} utcLabel={DISTRIBUTION_UTC_LABEL} />
    </div>
  );
}
