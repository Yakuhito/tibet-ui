import Link from 'next/link';
import Layout from '../components/Layout';
import TabContainer from '../components/TabContainer';

const Home: React.FC = () => {
  return (
    <Layout isHomePage>
      <TabContainer/>
      <Link href="/faq" className="m-12">
        <p className="text-gray-600 underline">FAQ &rarr;</p>
      </Link>
    </Layout>
  );
};

export default Home;
