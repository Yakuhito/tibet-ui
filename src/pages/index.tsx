import Head from 'next/head';

const TWEET_URL = 'https://x.com/TibetSwap/status/2092014706009518333?s=20';
const VAULT_ADDRESS = 'xch15jlnxjme2skxex7al0cth5t0lvx0nmgeln4eagsknms55aahzknsw3rh8y';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Important Notice | TibetSwap</title>
      </Head>
      <main className="max-w-2xl mx-auto">
        <h1 className="text-[2.75rem] leading-10 sm:text-5xl font-bold pb-8">Important notice</h1>

        <div className="space-y-6 leading-relaxed">
          <p>
            Earlier today, we received a report about a critical bug in the TibetSwap v2 puzzles. The vulnerability affected all live pools, putting the protocol&apos;s whole TVL at risk.
          </p>
          <p>
            Upon submission, the report was quickly confirmed, and a war room was created.
          </p>

          <p>Given:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>that the TibetSwap protocol is permissionless and no one can pause or upgrade it</li>
            <li>that an AI model found the vulnerability, and was also able to build a working PoC</li>
            <li>that a test on a pool had already been done on mainnet</li>
            <li>
              advice from trusted{' '}
              <a href="https://x.com/chia_project" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
                @chia_project
              </a>{' '}
              contacts
            </li>
          </ul>
          <p>We decided to take proactive action on behalf of all affected users.</p>

          <p>
            We closely monitored the chain and prepared to use the researcher-provided PoC code to rescue any remaining funds if a live exploit were detected. We also developed a separate rescue tool with additional safety checks.
          </p>
          <p>
            We believe we have successfully used the rescue tool to recover all the user funds that were locked in the TibetSwap protocol. At this time, we have no indication that the vulnerability was exploited by a malicious party.
          </p>

          <p>The funds are currently being consolidated into a single vault at this address:</p>
          <p className="font-mono text-sm break-all bg-brandDark/10 rounded-xl px-4 py-3">{VAULT_ADDRESS}</p>

          <p>
            We plan to distribute them back to the community based on on-chain data, and we will share a detailed plan with the community once it is finalized.
          </p>

          <div className="bg-brandDark/10 rounded-xl px-4 py-4 space-y-3">
            <p className="font-semibold">In the meantime, please do NOT:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>start any new TibetSwap pools</li>
              <li>deposit liquidity into existing pools</li>
              <li>trade TibetSwap pool LP tokens</li>
            </ul>
          </div>

          <p>
            We are incredibly grateful to{' '}
            <a href="https://x.com/Ealrann" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">@Ealrann</a>, who ethically reported the vulnerability. We also thank{' '}
            <a href="https://x.com/chia_project" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">@chia_project</a> for their assistance during this critical time.
          </p>
          <p>
            We plan to post a detailed post-mortem at a later date. Updates will only be shared through this official account. For any questions, please contact{' '}
            <a href="https://x.com/yakuhito" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">@yakuhito</a>.
          </p>
        </div>

        <a
          href={TWEET_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center justify-center font-medium px-6 py-3 rounded-xl bg-brandDark text-brandLight hover:opacity-90 transition"
        >
          Check for latest news
        </a>
      </main>
    </>
  );
};

export default Home;
