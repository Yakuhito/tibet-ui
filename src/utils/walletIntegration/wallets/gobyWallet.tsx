import WalletIntegrationInterface, { generateOffer } from '../walletIntegrationInterface';
import { toast } from 'react-hot-toast';
import { bech32m } from 'bech32';

class gobyWallet implements WalletIntegrationInterface {
  name = "Goby";
  image = "/assets/goby.webp";

  async connect(): Promise<void> {

    // Check if Goby extension is installed
    const { chia } = (window as any);
    if (!Boolean(chia && chia.isGoby)) {
      toast.error(<p>You don&apos;t have Goby Wallet installed. You can install it <a href="https://www.goby.app/" className="underline hover:opacity-80" target="_blank">here</a></p>);
      throw new Error()
    }

    try {
      await (window as any).chia.request({ method: "connect" });
      this.detectEvents()
    } catch (error: any) {
      throw error;
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
  }

  async generateOffer(requestAssets: generateOffer["requestAssets"], offerAssets: generateOffer["offerAssets"], fee: number | undefined): Promise<string | void> {
    // Goby wallet transaction signing logic
    try {
      const params = {
        requestAssets: requestAssets.map(asset => ({
          assetId: asset.assetId,
          amount: asset.amount
        })),
        offerAssets: offerAssets.map(asset => ({
          assetId: asset.assetId,
          amount: asset.amount
        })),
        fee
      }
      const response = await (window as any).chia.request({ method: 'createOffer', params })
      if (response.offer) {
        return response.offer;
      }
      return
    } catch (error: any) {
      throw error;
    }
  }

  getBalance(): void {
    // Goby wallet balance retrieval logic
  }

  async addAsset(assetId: string, symbol: string, logo: string, fullName: string): Promise<void> {
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
      toast.success(`Added ${symbol} to Goby`)
    } catch (error: any) {
      throw error;
    } 
  }

  async getAddress() {
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
      return null;
  }

  detectEvents(): void {
    const { chia } = window as any;
    chia.on("chainChanged", () => window.location.reload());
    chia.on("accountChanged", () => window.location.reload());
  }

}

export default gobyWallet;
