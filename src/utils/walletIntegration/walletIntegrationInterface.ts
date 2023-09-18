import WalletConnect from './wallets/walletConnect';
import HoogiiWallet from './wallets/hoogiiWallet';
import GobyWallet from './wallets/gobyWallet';

export const walletClasses: Record<string, any> = {
  Goby: GobyWallet,
  Hoogii: HoogiiWallet,
  WalletConnect: WalletConnect,
};

export interface generateOffer {
    requestAssets: {
      assetId: string
      amount: number
      image_url: string
      short_name: string
      name: string
      walletId?: number
    }[]
    offerAssets: {
      assetId: string
      amount: number
      image_url: string
      short_name: string
      name: string
      walletId?: number
    }[]
  }

interface WalletIntegrationInterface {
    name: string;
    image: string;
    connect(): void;
    disconnect(): void;
    generateOffer(requestAssets: generateOffer["requestAssets"], offerAssets: generateOffer["offerAssets"], fee: number | undefined): Promise<string | void>;
    getBalance(): void;
    addAsset(assetId: string, symbol: string, logo: string, fullName: string): Promise<void>;
    getAddress(): Promise<string | null>;
}
  
export default WalletIntegrationInterface;
  