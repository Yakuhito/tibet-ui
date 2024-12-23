export interface walletNamesType {
  walletNames: "Goby" | "Hoogii" | "WalletConnect";
}

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
    addAsset(assetId: string, symbol: string, logo: string, fullName: string): Promise<void | boolean>;
    getAddress(): Promise<string | null>;
}
  
export default WalletIntegrationInterface;
