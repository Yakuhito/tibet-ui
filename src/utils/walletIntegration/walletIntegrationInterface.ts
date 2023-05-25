interface WalletIntegrationInterface {
    name: string;
    image: string;
    connect(): void;
    disconnect(): void;
    generateOffer(requestAssets: {assetId: string; amount: number;}[], offerAssets: {assetId: string; amount: number;}[], fee: number | undefined): Promise<void>;
    getBalance(): void;
    addAsset(assetId: string, symbol: string, logo: string): Promise<void>;
}
  
export default WalletIntegrationInterface;
  