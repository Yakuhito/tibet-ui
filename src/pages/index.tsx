import Link from 'next/link';
import Layout from '../components/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold">Test</h1>
      <Link href="/faq">
        <p className="underline">Go to FAQ</p>
      </Link>
    </Layout>
  );
};

export default Home;
