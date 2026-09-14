import UtcLocalInstant from './UtcLocalInstant';

import {
  DISTRIBUTION_ISO,
  DISTRIBUTION_UTC_LABEL,
  SNAPSHOT_ISO,
  SNAPSHOT_UTC_LABEL,
} from '@/lib/refund/dates';

export default function SnapshotBanner() {
  return (
    <div className="bg-brandDark/10 rounded-xl px-4 py-4 space-y-3 leading-relaxed">
      <p>This is the final snapshot, taken on</p>
      <UtcLocalInstant iso={SNAPSHOT_ISO} utcLabel={SNAPSHOT_UTC_LABEL} />
      <p>The community may review it until</p>
      <UtcLocalInstant iso={DISTRIBUTION_ISO} utcLabel={DISTRIBUTION_UTC_LABEL} />
      <p>when distribution is scheduled to start.</p>
    </div>
  );
}
