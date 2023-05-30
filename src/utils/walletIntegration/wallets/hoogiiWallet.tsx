import WalletIntegrationInterface from '../walletIntegrationInterface';
import { toast } from 'react-hot-toast';
import { bech32m } from 'bech32';

class hoogiiWallet implements WalletIntegrationInterface {
  name = "Hoogii";
  image = "/assets/hoogii.png";

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

  disconnect(): void {
    // Hoogii wallet disconnection logic
    console.log('Disconnecting Hoogii Wallet')
  }

  async generateOffer(requestAssets: {assetId: string; amount: number;}[], offerAssets: {assetId: string; amount: number;}[], fee: number | undefined): Promise<void> {
    // Hoogii wallet transaction signing logic
    console.log('Generating offer with Hoogii Wallet')
    try {
      const params = {
        requestAssets,
        offerAssets,
        fee
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

  async getAddress() {
    console.log('Fetching Hoogii wallet address')
    // Check if Goby extension is installed
    const { chia } = (window as any);
    if (Boolean(chia && chia.hoogii.isHoogii)) {
      try {
        const puzzle_hash = await chia.hoogii.request({ method: 'accounts' });
        if (puzzle_hash.length) {
          return puzzle_hash[0];
        }
      } catch (error: any) {
        console.log(error)
        toast.error(`Wallet - ${error?.message || String(error.message)}`);
      }
    }
  }

  async addAsset(assetId: string, symbol: string, logo: string): Promise<void> {
    toast.error('Currently only Goby has support for adding an asset programatically')
  }
}

export default hoogiiWallet;
