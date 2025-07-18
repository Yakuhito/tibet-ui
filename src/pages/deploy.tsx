import Head from 'next/head';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

import { createPair, CreatePairResponse, isCoinSpent, refreshRouter } from '@/api';
import GeneralInput from '@/components/shared/GeneralInput';
import CompleteWithWalletModal from '@/components/trade_components/CompleteWithWalletModal';
import { useAppDispatch } from '@/hooks';
import { RootState } from '@/redux/store';
import { XCH } from '@/shared_tokens';
import WalletManager from '@/utils/walletIntegration/walletManager';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Deploy Pair/Pool | TibetSwap | The First AMM on Chia</title>
      </Head>
      <main className="max-w-[28rem] mx-auto">
        <Deploy />
      </main>
    </>
  );
};

const Deploy: React.FC<{}> = ({}) => {
  const dispatch = useAppDispatch();

  const address = useSelector((state: RootState) => state.wallet.address);
  const [assetId, setAssetId] = useState("");
  const [liquidityAddress, setLiquidityAddress] = useState(address ?? "");
  const [xchLiquidityAmountStr, setXchLiquidityAmountStr] = useState("1");
  const [catLiquidityAmountStr, setCatLiquidityAmountStr] = useState("");

  const [offer, setOffer] = useState<string>('');
  const INITIAL_STATUS = "Sending offer..."
  const [status, setStatus] = useState<string>(INITIAL_STATUS);
  const [createPairResponse, setCreatePairResponse] = useState<CreatePairResponse | null>(null);

  const xchLiquidityAmountOrNull = Math.floor(parseFloat(xchLiquidityAmountStr) * 1e12);
  const catLiquidityAmountOrNull = Math.floor(parseFloat(catLiquidityAmountStr) * 1e3);

  const infoCompleted = (assetId.length == 64 && (liquidityAddress?.length ?? 0) > 0 && (liquidityAddress?.startsWith("xch1") || liquidityAddress?.startsWith("txch1")) && xchLiquidityAmountOrNull && xchLiquidityAmountOrNull > 0 && catLiquidityAmountOrNull && catLiquidityAmountOrNull > 0) === true;

  const walletManager = new WalletManager();
  const connectedWallet = useSelector((state: RootState) => state.wallet.connectedWallet);
  const walletConnectSelectedSession = useSelector((state: RootState) => state.walletConnect.selectedSession);
  const isWalletConnectActuallyConnected = connectedWallet === "WalletConnect" ? Boolean(connectedWallet === "WalletConnect" && walletConnectSelectedSession) : true;

  const completeWithWallet = async () => {
      if (!connectedWallet) return;

      console.log('Completing with wallet')
      try {
          const offer = await walletManager.generateOffer(
              [],
              [
                {
                    assetId: XCH.asset_id,
                    amount: Math.floor(xchLiquidityAmountOrNull + catLiquidityAmountOrNull + 1 + 0.42 * 1e12 + 0.042 * 1e12),
                    image_url: XCH.image_url,
                    short_name: XCH.short_name,
                    name: XCH.name
                },
                {
                  assetId: assetId,
                  amount: catLiquidityAmountOrNull,
                  image_url: "",
                  short_name: "???",
                  name: "New Token"
              },
              ],
              0
          )
          if (offer) {
              setOffer(offer);
          }
      } catch (error: any) {
          console.log(error)
          toast.error(`Wallet - ${error.message}`)
      }
  }

  useEffect(() => {
    const func = async function() {
      if(infoCompleted && offer.length > 0 && offer.startsWith("offer1")) {
        if(createPairResponse === null) {
          let resp = await createPair(assetId, offer, xchLiquidityAmountOrNull, catLiquidityAmountOrNull, liquidityAddress);
          if(!resp.success){
            alert(resp.message);
            setOffer("");
          } else {
            setCreatePairResponse(resp);
            setStatus("Waiting for tx to be confirmed...")
          }
        } else {
          while(true) {
            const coin_confirmed = await isCoinSpent(createPairResponse.coin_id);
            if(coin_confirmed) {
              setStatus("Pair deployed successfully - refreshing router...");
              await new Promise((resolve) => setTimeout(resolve, 60000));
              await refreshRouter();
              setStatus("All done! :)");
              break;
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        }
      }
    }

    func();
  }, [offer, createPairResponse, infoCompleted]);

  return (
    <div className="rounded-2xl max-w-screen-sm w-full">
      <CompleteWithWalletModal />
      <h1 className="text-[2.75rem] leading-10 sm:text-2xl font-bold pb-2">Deploy New Pair</h1>

      {/* Liquidity Warning */}
      <div className="w-fill">
      <div className="bg-orange-400/50 dark:bg-orange-400/20 rounded-xl text-orange-700 p-4 flex items-center gap-4 mb-2 font-medium text-sm animate-fadeIn">
        <p>Providing liquidity carries associated risks, such as impermanent loss and the possibility of security vulnerabilities. Please take time to do your own research before adding assets to the protocol.</p>
      </div>

      {/* Token update process */}
      <div className="bg-blue-400/50 dark:bg-blue-800/20 rounded-xl text-blue-700 p-4 mt-1 flex items-center gap-4 mb-4 font-medium text-sm animate-fadeIn">
        <p>Token data will be fetched from Dexie <span className='font-bold'>immediately</span> after deployment. Further details updated (i.e., of name/symbol/image) need to be sent to our team for manual processing.</p>
      </div>

      <div className='space-y-2'>
        <GeneralInput
          value={assetId}
          onChange={setAssetId}
          helperText="0a1b...2c"
          label='Token Asset Id'
          small={true}
        />
        <GeneralInput
          value={liquidityAddress}
          onChange={setLiquidityAddress}
          helperText="xch1..."
          label='Initial Liquidity Tokens Recipient Address'
          small={true}
        />
        <GeneralInput
          value={xchLiquidityAmountStr}
          onChange={setXchLiquidityAmountStr}
          helperText="1.069"
          label='Initial Liquidity (XCH)'
        />
        <GeneralInput
          value={catLiquidityAmountStr}
          onChange={setCatLiquidityAmountStr}
          helperText="420.001"
          label='Initial Liquidity (CAT)'
        />
      </div>

      {/* Operation summary */}
      <div className="flex w-full p-2 mt-2 text-md">Transaction Summary</div>
      <div className="flex flex-col p-6 rounded-2xl pt-1 gap-1 bg-brandDark/0 text-sm">
        <div className="flex justify-between w-full">
          <p>Router Pair Deployment Fee</p>
          <p className="font-medium">0.042 XCH</p>
        </div>
        <div className="flex justify-between w-full">
          <p>Self-Service Fee</p>
          <p className="font-medium">0.42 XCH</p>
        </div>
        <div className="flex justify-between w-full">
          <p>Pair Singleton Amount</p>
          <p className="font-medium">1 mojo</p>
        </div>
        <div className="flex justify-between w-full">
          <p>Initial Liquidity (XCH)</p>
          <p className="font-medium">{xchLiquidityAmountOrNull ? (xchLiquidityAmountOrNull / 1e12).toString() : '?'} XCH</p>
        </div>
        <div className="flex justify-between w-full">
          <p>Initial Liquidity (CAT)</p>
          <p className="font-medium">{catLiquidityAmountOrNull ? (catLiquidityAmountOrNull / 1e3).toString() : '?'} CATs</p>
        </div>
        <div className="flex justify-between w-full">
          <p>Initial LP CATs Minting Fee</p>
          <p className="font-medium">{catLiquidityAmountOrNull ? (catLiquidityAmountOrNull / 1e12).toString() : '?'} XCH</p>
        </div>
        <div className="w-full border-b border-gray-200 mt-2 mb-2 "></div>
        <div className="flex justify-between w-full">
          <p>Total XCH Amount</p>
          <p className="font-medium">{(xchLiquidityAmountOrNull && catLiquidityAmountOrNull) ? ((0.42 * 1e12 + 0.042 * 1e12 + 1 + xchLiquidityAmountOrNull + catLiquidityAmountOrNull) / 1e12).toString() : '?'} XCH</p>
        </div>
        <div className="flex justify-between w-full">
          <p>Total CAT Amount</p>
          <p className="font-medium">{catLiquidityAmountOrNull ? (catLiquidityAmountOrNull / 1e3).toString() : '?'} CATs</p>
        </div>
      </div>

      {infoCompleted && offer.length == 0 && <div className='mt-4'>
        {/* Complete with Wallet Integration Button */}
        {connectedWallet && isWalletConnectActuallyConnected && <button className="bg-brandDark hover:opacity-90 bg-gradient-to-br from-[#7fa9b8]/90 to-brandDark/90 dark:from-brandDark dark:to-[#152f38] text-brandLight w-full py-4 rounded-xl font-medium" onClick={completeWithWallet}>Use Wallet to Generate Offer</button>}
        {connectedWallet && isWalletConnectActuallyConnected && <p className="flex w-full justify-center font-medium my-4">— OR —</p>}
        
        {/* Input for user to paste manually generated offer in */}
        <input type="text"
            value={offer}
            className='w-full py-4 px-4 border text-brandDark dark:border-brandDark dark:bg-brandDark/20 rounded-xl focus:outline-none focus:ring focus:ring-brandDark/40'
            onChange={e => setOffer(e.target.value)}
            placeholder='offer1...'
        />
      </div>}

      {infoCompleted && offer.length > 0 && offer.startsWith("offer1") && <div className='mt-4 text-center'>
        Status: {status}  
      </div>}
      
      </div>
    </div>
  )
}

export default Home;
