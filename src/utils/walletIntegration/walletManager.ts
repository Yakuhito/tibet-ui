import toast from 'react-hot-toast';

import { generateOffer, walletNamesType } from './walletIntegrationInterface';
import WalletConnect from './wallets/walletConnect';
import HoogiiWallet from './wallets/hoogiiWallet';
import GobyWallet from './wallets/gobyWallet';

import store, { RootState } from '@/redux/store';
import { setConnectedWallet } from '@/redux/walletSlice';

class WalletManager {

  private getWalletClassFromString(wallet: walletNamesType["walletNames"]) {
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

  public async connect(wallet: walletNamesType["walletNames"]): Promise<void> {
    try {
      const walletClass = this.getWalletClassFromString(wallet);
      const response = await walletClass.connect();
      if (response) {
        const address = await this.getAddress(wallet);
        const image = this.getImage(wallet);
        const name = this.getName(wallet);
        const setConnectedWalletInfo = {
          wallet,
          address,
          image,
          name
        }
        store.dispatch(setConnectedWallet(setConnectedWalletInfo))
      }
    } catch (error: any) {
      if (error.message) {
        toast.error(`Wallet - ${error.message}`);
      }
    }
  }

  public async disconnect(wallet: walletNamesType["walletNames"]): Promise<void> {
    const walletClass = this.getWalletClassFromString(wallet);
    const response = await walletClass.disconnect();
    if (response) store.dispatch(setConnectedWallet(null));
  }

  public async generateOffer(requestAssets: generateOffer["requestAssets"], offerAssets: generateOffer["offerAssets"], fee: number | undefined): Promise<string | void> {
    const state = store.getState() as RootState;
    const connectedWallet = state.wallet.connectedWallet;
    if (!connectedWallet) throw Error('You must connect a wallet to add an asset');
    const walletClass = this.getWalletClassFromString(connectedWallet);
    const offer = await walletClass.generateOffer(requestAssets, offerAssets, fee);
    if (offer) {
      return offer;
    }
  }

  public async addAsset(assetId: string, symbol: string, logo: string, fullName: string): Promise<void | boolean> {
    const state = store.getState() as RootState;
    const connectedWallet = state.wallet.connectedWallet;
    if (!connectedWallet) throw Error('You must connect a wallet to add an asset');
    try {
      const walletClass = this.getWalletClassFromString(connectedWallet);
      await walletClass.addAsset(assetId, symbol, logo, fullName);
      return true;
    } catch (error: any) {
        console.error(error)
    }
  }

  public async getAddress(wallet: walletNamesType["walletNames"]): Promise<string | null> {
    const walletClass = this.getWalletClassFromString(wallet);
    return await walletClass.getAddress();
  }

  public getImage(wallet: walletNamesType["walletNames"]): string | null {
    const walletClass = this.getWalletClassFromString(wallet);
    return walletClass.image;
  }

  public getName(wallet: walletNamesType["walletNames"]): string | null {
    const walletClass = this.getWalletClassFromString(wallet);
    return walletClass.name;
  }

  public async detectEvents(): Promise<void> {
    const wallet = store.getState().wallet.connectedWallet;
    if (wallet) {
      const walletClass = this.getWalletClassFromString(wallet);
      return await walletClass.detectEvents();
    }
  }

}

export default WalletManager;
