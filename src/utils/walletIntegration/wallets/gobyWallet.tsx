import WalletIntegrationInterface from '../walletIntegrationInterface';
import WalletManager from '../walletManager';
import { toast } from 'react-hot-toast';

class gobyWallet implements WalletIntegrationInterface {
  name = "Goby";
  image = "/assets/goby.webp";

  constructor() {
    // Detect disconnect via Goby browser extension
    // Check if Goby extension is installed
    const { chia } = (window as any);
    if (Boolean(chia && chia.isGoby)) {
      const walletManager = WalletManager.getInstance()

      chia.on("accountChanged", () => {
        console.log(chia)
        if (chia.selectedAddress) return // If Goby is still connected
        if (walletManager.getActiveWallet() instanceof gobyWallet) return walletManager.disconnect();
      });
    }
  }

  async connect(): Promise<boolean> {
    // Goby wallet connection logic
    console.log('Connecting Goby Wallet')
    // Check if Goby extension is installed
    const { chia } = (window as any);
    if (!Boolean(chia && chia.isGoby)) {
      toast.error(<p>You don&apos;t have Goby Wallet installed. You can install it <a href="https://www.goby.app/" className="underline hover:opacity-80" target="_blank">here</a></p>);
      return false
    }

    try {
      await (window as any).chia.request({ method: "connect" });
      toast.success('Successfully Connected')
      return true
    } catch (error: any) {
        console.log(error)
        toast.error(`Wallet - ${error?.message || String(error.message)}`);
        return false
    }
  }

  async eagerlyConnect(): Promise<boolean> {
    try {
      await (window as any).chia.request({ method: "connect" , "params": {eager: true}})
      return true
    } catch (error: any) {
        console.log(error)
        toast.error(`Wallet - ${error?.message || String(error.message)}`);
        return false
    }
  }

  disconnect(): void {
    // Goby wallet disconnection logic
    console.log('Disconnecting Goby Wallet')
  }

  async generateOffer(requestAssets: {assetId: string; amount: number;}[], offerAssets: {assetId: string; amount: number;}[]): Promise<void> {
    // Goby wallet transaction signing logic
    console.log('Generating offer with Goby Wallet')
    try {
      const params = {
        requestAssets,
        offerAssets
      }
      const response = await (window as any).chia.request({ method: 'createOffer', params })
      console.log('Fetching offer', response)
      return response
    } catch (error: any) {
        console.log(error)
        toast.error(`Wallet - ${error?.message || String(error.message)}`);
    }
  }

  getBalance(): void {
    // Goby wallet balance retrieval logic
    console.log('Getting Goby Wallet Balance')
  }
}

export default gobyWallet;
