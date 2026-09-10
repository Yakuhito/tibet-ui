import dynamic from 'next/dynamic';
import Head from 'next/head';

import CheckFormShell from '@/components/refund/CheckFormShell';

const CheckClient = dynamic(() => import('@/components/refund/CheckClient'), {
  ssr: false,
  loading: () => <CheckFormShell disabled />,
});

const CheckPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Check your assets | TibetSwap</title>
      </Head>
      <CheckClient />
    </>
  );
};

export default CheckPage;
