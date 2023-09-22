import { generateOffer } from './walletIntegrationInterface';
import { connectWallet } from '@/redux/walletSlice';
import store from '@/redux/store';

import WalletConnect from './wallets/walletConnect';
import HoogiiWallet from './wallets/hoogiiWallet';
import GobyWallet from './wallets/gobyWallet';

class WalletManager {

  private getWalletClassFromString(wallet: string) {
    const walletClasses: Record<string, any> = {
      Goby: GobyWallet,
      Hoogii: HoogiiWallet,
      WalletConnect: WalletConnect,
    };
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
  }

  public async generateOffer(wallet: string, requestAssets: generateOffer["requestAssets"], offerAssets: generateOffer["offerAssets"], fee: number | undefined): Promise<string | void> {
    const walletClass = this.getWalletClassFromString(wallet);
    const offer = await walletClass.generateOffer(requestAssets, offerAssets, fee);
    return offer;
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
    store.dispatch(connectWallet(wallet));
    return await walletClass.detectEvents();
  }

}

export default WalletManager;
