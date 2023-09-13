import { generateOffer, walletClasses } from './walletIntegrationInterface';

class WalletManager {

  private getWalletClassFromString(wallet: string) {
    const WalletClass = new walletClasses[wallet]();
    if (!WalletClass) {
      throw new Error(`${wallet} is not currently integrated with TibetSwap`);
    }
    return WalletClass;
  }

  public async connect(wallet: string): Promise<void> {
    const walletClass = this.getWalletClassFromString(wallet);
    await walletClass.connect();
  }

  public async disconnect(wallet: string): Promise<void> {
    const walletClass = this.getWalletClassFromString(wallet);
    await walletClass.disconnect();
    // console.log('Disconnected Wallet', walletClass.name)
  }

  public async generateOffer(wallet: string, requestAssets: generateOffer["requestAssets"], offerAssets: generateOffer["offerAssets"], fee: number | undefined): Promise<string | void> {
    const walletClass = this.getWalletClassFromString(wallet);
    await walletClass.generateOffer(requestAssets, offerAssets, fee);
  }

  public async addAsset(wallet: string, assetId: string, symbol: string, logo: string, fullName: string): Promise<void> {
    const walletClass = this.getWalletClassFromString(wallet);
    await walletClass.addAsset(assetId, symbol, logo, fullName);
  }

  public async getAddress(wallet: string): Promise<string | null> {
    const walletClass = this.getWalletClassFromString(wallet);
    return await walletClass.getAddress();
  }

  public getImage(wallet: string): string | null {
    const walletClass = this.getWalletClassFromString(wallet);
    return walletClass.image;
  }

  public getName(wallet: string): string | null {
    const walletClass = this.getWalletClassFromString(wallet);
    return walletClass.name;
  }

  public async detectEvents(wallet: string): Promise<void> {
    const walletClass = this.getWalletClassFromString(wallet);
    return await walletClass.detectEvents();
  }

}

export default WalletManager;
