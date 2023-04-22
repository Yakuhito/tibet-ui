import Link from 'next/link';
import Layout from '../components/Layout';
import TabContainer from '../components/TabContainer';
import { useState } from 'react';

const Home: React.FC = () => {
  const [pairLauncherId, setPairLauncherId] = useState<string | null>(null);
  const link = process.env.NEXT_PUBLIC_INFO_BASE_URL + (
    pairLauncherId === null ? "" : `/pair/${pairLauncherId}`
  );

  return (
    <Layout isHomePage>
      <TabContainer onPairSelect={setPairLauncherId}/>
      <a target="_blank" href={link} rel="noopener noreferrer" className="mb-1 mt-8">
      <p className="text-gray-600 underline">Analytics &rarr;</p>
      </a>
      <Link href="/faq" className="mb-12">
        <p className="text-gray-600 underline">FAQ &rarr;</p>
      </Link>
    </Layout>
  );
};

export default Home;
