interface WalletIntegrationInterface {
    name: string;
    connect(): void;
    disconnect(): void;
    generateOffer(requestAssets: {assetId: string; amount: number;}[], offerAssets: {assetId: string; amount: number;}[]): Promise<void>;
    getBalance(): void;
}
  
export default WalletIntegrationInterface;
  