import Head from 'next/head';
import Link from 'next/link';

import UtcLocalInstant from '@/components/refund/UtcLocalInstant';
import {
  DISTRIBUTION_ISO,
  DISTRIBUTION_UTC_LABEL,
  SNAPSHOT_ISO,
  SNAPSHOT_UTC_LABEL,
} from '@/lib/refund/dates';

const ANNOUNCEMENT_URL = 'https://x.com/TODO';
const POST_MORTEM_URL = 'https://kuhi.to/TODO';
const FAREWELL_URL = 'https://kuhi.to/TODO';
const INITIAL_ANNOUNCEMENT_URL = 'https://x.com/TibetSwap/status/2092014706009518333?s=20';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Overview | TibetSwap</title>
      </Head>
      <main className="max-w-2xl mx-auto">
        <h1 className="text-[2.75rem] leading-10 sm:text-5xl font-bold pb-8">TibetSwap v2 Refunds</h1>

        <div className="space-y-6 leading-relaxed">
          <p>LP holders will be paid as if they removed liquidity at rescue time.</p>
          <p>Burned LP will go to whoever sent it to the burn address.</p>
          <p>Bridged liquidity (TIBET-NeckCoin-XCH) will be distributed once the bridge is back online.</p>
          <div className="space-y-3">
            <p>The final LP snapshot will be taken on</p>
            <UtcLocalInstant iso={SNAPSHOT_ISO} utcLabel={SNAPSHOT_UTC_LABEL} />
            <p>Before, the refund rules are public and open to change. After the final snapshot, the community may review the snapshot until</p>
            <UtcLocalInstant iso={DISTRIBUTION_ISO} utcLabel={DISTRIBUTION_UTC_LABEL} />
            <p>when distribution is scheduled to start.</p>
          </div>

          <div className="bg-brandDark/10 rounded-xl px-4 py-4 space-y-3">
            <p>It is best if you do not deposit or trade LP until the final snapshot is taken on</p>
            <UtcLocalInstant iso={SNAPSHOT_ISO} utcLabel={SNAPSHOT_UTC_LABEL} />
            <p>After that, LP tokens will become purely commemorative.</p>
          </div>

          <ul className="space-y-2">
            <li>
              <a href={ANNOUNCEMENT_URL} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
                Announcement
              </a>
            </li>
            <li>
              <a href={POST_MORTEM_URL} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
                Post-mortem
              </a>
            </li>
            <li>
              <a href={FAREWELL_URL} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
                Farewell
              </a>
            </li>
            <li>
              <a href={INITIAL_ANNOUNCEMENT_URL} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
                Initial announcement
              </a>
            </li>
          </ul>
        </div>

        <Link
          href="/check"
          className="mt-10 inline-flex items-center justify-center font-medium px-6 py-3 rounded-xl bg-brandDark text-brandLight hover:opacity-90 transition"
        >
          Check your assets
        </Link>
      </main>
    </>
  );
};

export default Home;
