import WalletIntegrationInterface from '../walletIntegrationInterface';
import { toast } from 'react-hot-toast';

class hoogiiWallet implements WalletIntegrationInterface {
  name = "Hoogii"

  async connect(): Promise<boolean> {
    // Hoogii wallet connection logic
    console.log('Connecting Hoogii Wallet')
    // Check if Hoogii extension is installed
    const { chia } = (window as any);
    if (!Boolean(chia && chia.hoogii.isHoogii)) {
      toast.error(<p>You don&apos;t have Hoogii Wallet installed. You can install it <a href="https://hoogii.app/" className="underline hover:opacity-80" target="_blank">here</a></p>);
      return false
    }

    try {
      await (window as any).chia.hoogii.request({ method: "connect" });
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
      await (window as any).chia.hoogii.request({ method: "connect" , "params": {eager: true}})
      return true
    } catch (error: any) {
        console.log(error)
        toast.error(`Wallet - ${error?.message || String(error.message)}`);
        return false
    }
  }

  disconnect(): void {
    // Hoogii wallet disconnection logic
    console.log('Disconnecting Hoogii Wallet')
  }

  async generateOffer(requestAssets: {assetId: string; amount: number;}[], offerAssets: {assetId: string; amount: number;}[]): Promise<void> {
    // Hoogii wallet transaction signing logic
    console.log('Generating offer with Hoogii Wallet')
    try {
      const params = {
        requestAssets,
        offerAssets
      }
      const response = await (window as any).chia.hoogii.request({ method: 'createOffer', params })
      console.log('Fetching offer', response)
      return response
    } catch (error: any) {
        console.log(error)
        toast.error(`Wallet - ${error?.message || String(error.message)}`);
    }
  }

  getBalance(): void {
    // Hoogii wallet balance retrieval logic
    console.log('Getting Hoogii Wallet Balance')
  }
}

export default hoogiiWallet;
