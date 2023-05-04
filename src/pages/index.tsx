import TabContainer from '../components/TabContainer';
import { useState } from 'react';

const Home: React.FC = () => {
  const [pairLauncherId, setPairLauncherId] = useState<string | null>(null);
  const link = process.env.NEXT_PUBLIC_INFO_BASE_URL + (
    pairLauncherId === null ? "" : `/pair/${pairLauncherId}`
  );

  return (
      <main className="max-w-[28rem]">
        <TabContainer onPairSelect={setPairLauncherId} />
      </main>
  );
};

export default Home;
