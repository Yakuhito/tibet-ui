import { toast } from 'react-hot-toast';

import WalletIntegrationInterface, { generateOffer } from '../walletIntegrationInterface';

class hoogiiWallet implements WalletIntegrationInterface {
  name = "Hoogii";
  image = "/assets/hoogii.png";

  async connect(): Promise<void> {

    // Check if Hoogii extension is installed
    const { chia } = (window as any);
    if (!Boolean(chia && chia.hoogii.isHoogii)) {
      toast.error(<p>You don&apos;t have Hoogii Wallet installed. You can install it <a href="https://hoogii.app/" className="underline hover:opacity-80" target="_blank">here</a></p>, { id: 'hoogii-not-installed' });
      throw new Error()
    }

    try {
      const response = await (window as any).chia.hoogii.request({ method: "connect" });
      this.detectEvents()
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async eagerlyConnect(): Promise<boolean> {
    // Hoogii injects a script which usually loads after the initial page load, meaning it doesn't exist at the time of running this code.
    // This checks for Hoogii for a maximum of 5 seconds after page load.
    const maxAttempts = 10; // Maximum number of attempts to check for Hoogii
    const pollInterval = 500; // Interval between each check (in milliseconds)
    const timeout = 5000; // Timeout for checking Hoogii availability (in milliseconds)
  
    return new Promise<boolean>((resolve) => {
      let attempts = 0;
      let intervalId: ReturnType<typeof setInterval>;
  
      const checkHoogii = () => {
        const { chia } = (window as any);
        if (!Boolean(chia && chia.hoogii.isHoogii)) {
          toast.error(<p>You don&apos;t have Hoogii Wallet installed. You can install it <a href="https://hoogii.app/" className="underline hover:opacity-80" target="_blank">here</a></p>);
          clearInterval(intervalId);
          resolve(false);
        } else {
          (window as any).chia.hoogii
            .request({ method: 'connect', params: { eager: true } })
            .then(() => {
              clearInterval(intervalId);
              this.detectEvents()
              resolve(true);
            })
            .catch((error: any) => {
              console.log(error);
              toast.error(`Wallet - ${error?.message || String(error.message)}`);
              clearInterval(intervalId);
              resolve(false);
            });
        }
      };
  
      // Check if Hoogii is already available
      if ((window as any).chia && (window as any).chia.hoogii) {
        checkHoogii();
      } else {
        // Wait for Hoogii to become available
        intervalId = setInterval(() => {
          attempts++;
  
          if ((window as any).chia && (window as any).chia.hoogii) {
            checkHoogii();
          } else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            resolve(false);
          }
        }, pollInterval);
  
        // Timeout if Hoogii doesn't become available within the specified time
        setTimeout(() => {
          clearInterval(intervalId);
          resolve(false);
        }, timeout);
      }
    });
  }

  disconnect(): void | boolean {
    // Hoogii wallet disconnection logic
    return true;
  }

  async generateOffer(requestAssets: generateOffer["requestAssets"], offerAssets: generateOffer["offerAssets"], fee: number | undefined): Promise<string | void> {
    // Hoogii wallet transaction signing logic
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
      const response = await (window as any).chia.hoogii.request({ method: 'createOffer', params })
      if (response.offer) {
        return response.offer
      }
      return
    } catch (error: any) {
      throw error;
    }
  }

  getBalance(): void {
    // Hoogii wallet balance retrieval logic
  }

  async addAsset(assetId: string, symbol: string, logo: string, fullName: string): Promise<void | boolean> {
    throw new Error("Hoogii doesn't have support for adding an assets programatically");
  }

  async getAddress() {
    // Check if Goby extension is installed
    const { chia } = (window as any);
    if (Boolean(chia && chia.hoogii.isHoogii)) {
      try {
        const puzzle_hash = await chia.hoogii.request({ method: 'accounts' });
        if (puzzle_hash.length) {
          return puzzle_hash[0];
        }
      } catch (error: any) {
        throw error;
      }
    }
  }

  detectEvents(): void {
    const { chia } = window as any;
    chia.hoogii.on("chainChanged", () => window.location.reload());
  }
}

export default hoogiiWallet;
