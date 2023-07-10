import WalletIntegrationInterface from '../walletIntegrationInterface';
import SignClient from "@walletconnect/sign-client";
import Client from '@walletconnect/sign-client';
import { toast } from 'react-hot-toast';
import { closeWalletConnectModal, showWalletConnectModal } from '../WalletConnectModal';

class WalletConnectIntegration implements WalletIntegrationInterface {
  name = "WalletConnect"
  image = "/assets/xch.webp"
  chainId = process.env.NEXT_PUBLIC_XCH === "TXCH" ? "chia:testnet" : "chia:mainnet"
  fingerprint
  topic
  client: SignClient | undefined
  
  constructor() {
    // Restore active session fingerprint & topic (if any) to object property for later use
    const fingerprint = localStorage.getItem('wc_fingerprint');
    if (fingerprint) {this.fingerprint = JSON.parse(fingerprint);}
    
    const topic = localStorage.getItem('wc_topic');
    if (topic) {this.topic = JSON.parse(topic);}
  }

  async connect(): Promise<boolean> {
    // If existing connection still exists, return true, else display QR code to initiate new connection
    if (await this.eagerlyConnect()) {
      return true;
    }
    
    // Initiate connection and pass pairing uri to the modal (QR code)
    try {
      const signClient = await this.signClient();
        if (signClient) {
          const namespaces = {
            chia: {
              methods: [
                "chia_createOfferForIds",
                "chia_getWallets",
              ],
              chains: ["chia:mainnet"],
              events: [],
            },
          };

          // Fetch uri to display QR code to establish new wallet connection
          var { uri, approval } = await signClient.connect({
            requiredNamespaces: namespaces,
          });

          // Display QR code to user
          if (uri) {
            showWalletConnectModal(uri)
          }

          // If new connection established successfully
          const session = await approval();
          console.log('Connected Chia wallet via WalletConnect', session, signClient)
          // Save session fingerprint to localstorage for persistence
          localStorage.setItem('wc_fingerprint', JSON.stringify(session.namespaces.chia.accounts[0].split(":")[2]))
          localStorage.setItem('wc_topic', JSON.stringify(session.topic))
          this.fingerprint = Number(session.namespaces.chia.accounts[0].split(":")[2]);
          this.topic = session.topic;
          closeWalletConnectModal()
          toast.success('Successfully Connected')

          return true
        }
    } catch (error) {
      console.log('Error:', error)
      toast.error(`Wallet - ${error}`)
    }
    return false
  }

  async eagerlyConnect(): Promise<boolean> {
    // Sign client, fetch pairing data. If active pairing, previous connection must exist.
    try {
      const signClient = await this.signClient();

      if (signClient?.pairing.getAll({ active: true }).length) {
        console.log(signClient.session.keys)
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error(`Wallet - ${error}`)
      return false;
    }

    localStorage.removeItem('wc_fingerprint')
    localStorage.removeItem('wc_topic')
    return false;
  }

  disconnect(): void {
    // WalletConnect disconnection logic
  }

  // seems strange that this is returning Promise<void>
  async generateOffer(requestAssets: {assetId: string; amount: number;}[], offerAssets: {assetId: string; amount: number;}[], fee: number | undefined): Promise<void> {
    // Sign client
    const signClient = await this.signClient();
    
    // Fetch previous connection
    try {
        if (!this.topic || !signClient) {
          toast.error('Not connected via WalletConnect or could not sign client')
          return;
        }

        // Send request to generate offer via WalletConnect
        const resultOffer = await signClient.request({
          topic: this.topic,
          chainId: "chia:mainnet",
          request: {
            method: "chia_createOfferForIds",
            params: {
              fingerprint: this.fingerprint,
              offer: {
                1: -1002146999,
                3: 617,
              },
              fee,
              driverDict: {},
              disableJSONFormatting: true,
            },
          },
        });

    } catch (error) {
      toast.error(`Wallet - ${error}`)
    }
    
  }

  getBalance(): void {
    // WalletConnect balance retrieval logic
  }

  async getWallets() {
    // Sign client
    const signClient = await this.signClient();
    
    // Fetch previous connection
    try {
        if (!this.topic || !signClient) {
          toast.error('Not connected via WalletConnect or could not sign client')
          return;
        }

        // Send request to get Wallets via WalletConnect
        const wallets = await signClient.request({
          topic: this.topic,
          chainId: "chia:mainnet",
          request: {
            method: "chia_getWallets",
            params: {
              fingerprint: this.fingerprint,
              includeData: true
            },
          },
        });

        console.log({ wallets })

    } catch (error: any) {
      toast.error(`Wallet - ${error.message}`)
    }
  }

  async addAsset(assetId: string, symbol: string, logo: string): Promise<void> {
    toast.error('Support for adding assets via WalletConnect will be added soon.')
  }

  async getAddress() {
    
  }

  async signClient(): Promise<void | Client> {
    // If client has been saved to object, return that instead of completing a new sign
    if (this.client) return this.client;

    try {
      const client = await SignClient.init({
        logger: "info",
        projectId: '4f20af8b3b6f6274527fe9daa104942c',
        metadata: {
          name: "TibetSwap",
          description: "The first decentralized AMM running on the Chia blockchain.",
          url: "https://v2.tibetswap.io/",
          icons: ["https://v2.tibetswap.io/logo.jpg"],
        },
      });
      this.client = client;
      return client;
    } catch (e) {
      console.log(e);
      toast.error(`Wallet - ${e}`)
    }
  }
}

export default WalletConnectIntegration;
