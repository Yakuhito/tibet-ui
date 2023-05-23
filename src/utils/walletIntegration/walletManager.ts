import WalletIntegrationInterface from './walletIntegrationInterface';
import GobyWallet from './wallets/gobyWallet';
import WalletConnect from './wallets/walletConnect';
import HoogiiWallet from './wallets/hoogiiWallet';

class WalletManager {
  private static instance: WalletManager;
  private activeWallet: WalletIntegrationInterface | null;

  private constructor() {
    this.activeWallet = null;
    this.getStoredWallet()
      .then((storedWallet) => {
        if (storedWallet) {
          this.activeWallet = storedWallet;
          this.notifyActiveWalletChange();
        }
      })
      .catch((error) => {
        this.notifyActiveWalletChange();
        console.error('Error retrieving stored wallet:', error);
      });
  }

  public static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  private async getStoredWallet(): Promise<WalletIntegrationInterface | null> {
      const storedWallet = await this.deserializeWallet();
      return storedWallet ? storedWallet : null;
  }

  public setActiveWallet(wallet: WalletIntegrationInterface): void {
    this.activeWallet = wallet;
    localStorage.setItem('activeWallet', this.activeWallet.name);
    this.notifyActiveWalletChange();
  }
  
  private notifyActiveWalletChange(): void {
    if (this.activeWalletChangeHandler) {
      if (this.activeWallet !== null) {
        this.activeWalletChangeHandler(this.activeWallet);
      } else {
        this.activeWalletChangeHandler(null);
      }
    }
  }
  
  private activeWalletChangeHandler: ((wallet: WalletIntegrationInterface | null) => void) | null = null;
  
  public registerActiveWalletChangeHandler(handler: (wallet: WalletIntegrationInterface | null) => void): void {
    this.activeWalletChangeHandler = handler;
  }
  
  public unregisterActiveWalletChangeHandler(handler: (wallet: WalletIntegrationInterface) => void): void {
    if (this.activeWalletChangeHandler === handler) {
      this.activeWalletChangeHandler = null;
    }
  }

  public getActiveWallet(): WalletIntegrationInterface | null {
    return this.activeWallet;
  }

  public connect(): void {
    if (this.activeWallet) {
      this.activeWallet.connect();
    }
  }

  public disconnect(): void {
    if (this.activeWallet) {
      this.activeWallet.disconnect();
    }
    localStorage.removeItem('activeWallet');
    this.activeWallet = null;
    this.notifyActiveWalletChange();
  }

  public async generateOffer(requestAssets: {assetId: string; amount: number;}[], offerAssets: {assetId: string; amount: number;}[]): Promise<void> {
    if (this.activeWallet) {
      this.activeWallet.generateOffer(requestAssets, offerAssets);
    }
  }

  public getBalance(): void {
    if (this.activeWallet) {
      this.activeWallet.getBalance();
    }
  }

  private async deserializeWallet(): Promise<WalletIntegrationInterface | null> {
    const parsedWallet = localStorage.getItem('activeWallet')
    if (parsedWallet === 'Goby') {
        const checkIfStillConnected = await new GobyWallet().eagerlyConnect()
        if (!checkIfStillConnected) {
            localStorage.removeItem('activeWallet');
            return null
        }
        return new GobyWallet();
    } else if (parsedWallet === 'Hoogii') {
        const checkIfStillConnected = await new HoogiiWallet().eagerlyConnect()
        if (!checkIfStillConnected) {
            localStorage.removeItem('activeWallet');
            return null
        }
        return new HoogiiWallet();
    } else if (parsedWallet === 'WalletConnect') {
      const checkIfStillConnected = await new WalletConnect().eagerlyConnect()
      if (!checkIfStillConnected) {
          localStorage.removeItem('activeWallet');
          return null
      }
      return new WalletConnect();
    }

    return null;
  }
}

export default WalletManager;