import Head from 'next/head';

const SNAPSHOT_GIST_URL = 'https://gist.github.com/Yakuhito/e8808422e3a6fbf4d5759ee822db1d95';
const INITIAL_RESCUE_ANNOUNCEMENT_URL = 'https://x.com/TibetSwap/status/2092014706009518333?s=20';
const RESCUE_UPDATE_URL = 'https://x.com/TibetSwap/status/2097993672889409799?s=20';
const POST_MORTEM_URL = 'https://blog.kuhi.to/tibetswap-v2-post-mortem';
const FAREWELL_URL = 'https://blog.kuhi.to/so-long-and-thanks-for-all-the-trades';

const LINKS = [
  { href: SNAPSHOT_GIST_URL, label: 'Final snapshot' },
  { href: INITIAL_RESCUE_ANNOUNCEMENT_URL, label: 'Initial rescue announcement' },
  { href: RESCUE_UPDATE_URL, label: 'Rescue update' },
  { href: POST_MORTEM_URL, label: 'Post-mortem' },
  { href: FAREWELL_URL, label: 'Farewell' },
];

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>TibetSwap</title>
      </Head>
      <main className="max-w-2xl mx-auto text-center">
        <p className="leading-relaxed">
          After 4 years of powering trading on Chia, TibetSwap has shut down following a white-hat rescue of all liquidity. All funds have been returned to liquidity providers on 16 September 2026. Chia community - thank you very much.
        </p>

        <ul className="mt-10 space-y-2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default Home;
