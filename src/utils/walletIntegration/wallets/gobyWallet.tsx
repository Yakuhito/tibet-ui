import WalletIntegrationInterface from '../walletIntegrationInterface';
import { toast } from 'react-hot-toast';
import { bech32m } from 'bech32';

class gobyWallet implements WalletIntegrationInterface {
  name = "Goby";
  image = "/assets/goby.webp";

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
      this.detectEvents()
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
      this.detectEvents()
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

  async generateOffer(requestAssets: {assetId: string; amount: number;}[], offerAssets: {assetId: string; amount: number;}[], fee: number | undefined): Promise<void> {
    // Goby wallet transaction signing logic
    console.log('Generating offer with Goby Wallet')
    try {
      const params = {
        requestAssets,
        offerAssets,
        fee
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

  async addAsset(assetId: string, symbol: string, logo: string): Promise<void> {

    // Goby wallet transaction signing logic
    console.log(`Adding ${symbol} to Goby`)

    // Potentially modified values
    let symbolM = symbol
    let logoM = logo

    // Ensure symbol is maximum 12 characters (for LP tokens)
    if (symbol.includes('TIBET-')) {
      symbolM = symbol.replace('TIBET-', 'TB-').substring(0, 12);
      logoM = 'https://v2.tibetswap.io/logo.jpg';
    }

    try {
      const params = {
        type: 'cat',
        options: {
          assetId,
          symbol: symbolM,
          logo: logoM
        }
      }
      const response = await (window as any).chia.request({ method: 'walletWatchAsset', params })
      console.log('Fetching offer', response)
      return response
    } catch (error: any) {
        console.log(error)
        toast.error(`Wallet - ${error?.message || String(error.message)}`);
    }    
  }

  async getAddress() {
    console.log('Fetching Goby wallet address')
    // Check if Goby extension is installed
    const { chia } = (window as any);
      if (Boolean(chia && chia.isGoby)) {
        const puzzle_hash = chia.selectedAddress;
        if (puzzle_hash) {
          // Convert puzzle_hash to Chia address
          const prefix = chia.chainId === "0x01" ? "XCH" : "TXCH";
          if (prefix) {
            const words = bech32m.toWords(Buffer.from(puzzle_hash, 'hex'));
            return bech32m.encode(prefix, words);
          }
        }
      }
  }

  detectEvents(): void {
    console.log('Detecting Goby events');
    const { chia } = window as any;
    chia.on("chainChanged", () => window.location.reload());
    chia.on("accountChanged", () => window.location.reload());
  }

}

export default gobyWallet;
