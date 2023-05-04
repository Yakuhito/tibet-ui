import Link from 'next/link';
import Layout from '../components/Layout';
import TabContainer from '../components/TabContainer';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

const Home: React.FC = () => {
  const [pairLauncherId, setPairLauncherId] = useState<string | null>(null);
  const link = process.env.NEXT_PUBLIC_INFO_BASE_URL + (
    pairLauncherId === null ? "" : `/pair/${pairLauncherId}`
  );

  return (
    <>
      <Navbar path="" />
      <Layout isHomePage>
        <TabContainer onPairSelect={setPairLauncherId}/>
      </Layout>
    </>
  );
};

export default Home;
