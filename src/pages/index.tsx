import Link from 'next/link';
import Layout from '../components/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Testing... 1... 2... 3...</h1>
      <p className="mb-6 text-left">
        Uh oh! You&apos;ve accessed this site too early and caught us unprepared. We&apos;re still working on the UI, so please come back later :)
      </p>
      <Link href="/faq">
        <p className="text-gray-600 underline">FAQ &rarr;</p>
      </Link>
    </Layout>
  );
};

export default Home;
