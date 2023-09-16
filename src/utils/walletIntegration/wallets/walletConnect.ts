import { setUserMustAddTheseAssetsToWallet, setOfferRejected, setRequestStep } from '@/redux/completeWithWalletSlice';
import WalletIntegrationInterface, { generateOffer } from '../walletIntegrationInterface';
import { getAllSessions, setPairingUri, selectSession } from '@/redux/walletConnectSlice';
import { connectWallet, disconnectWallet } from '@/redux/walletSlice';
import type { SessionTypes } from "@walletconnect/types";
import SignClient from "@walletconnect/sign-client";
import Client from '@walletconnect/sign-client';
import store from '../../../redux/store';
import { toast } from 'react-hot-toast';


interface wallet {
  data: string
  id: number
  name: string
  type: 6
  meta: {
    assetId: string
    name: string
  }
}

interface wallets {
  data: wallet[]
  isError: boolean
  isSuccess: boolean
}

class WalletConnectIntegration implements WalletIntegrationInterface {
  name = "WalletConnect"
  image = "/assets/xch.webp"
  chainId = process.env.NEXT_PUBLIC_XCH === "TXCH" ? "chia:testnet" : "chia:mainnet"
  topic
  client: SignClient | undefined
  selectedFingerprint
  session: SessionTypes.Struct | undefined
  
  constructor() {
    // Give methods access to current Redux state
    const state = store.getState();
    const selectedSession = state.walletConnect.selectedSession;
    if (selectedSession) {
      this.topic = selectedSession.topic;
      this.session = selectedSession;
      const fingerprint = state.walletConnect.selectedFingerprint[selectedSession.topic];
      this.selectedFingerprint = fingerprint;
    }
  }

  async updateSessions() {
    await store.dispatch(getAllSessions())
  }

  async deleteTopicFromLocalStorage(topic: string) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('wc') && key.endsWith('//session')) {
          const responseList = await JSON.parse(localStorage.getItem(key)!);
          localStorage.setItem(key!, JSON.stringify(responseList.filter((item: { topic: string }) => item.topic !== topic)));
      }
    }   
  }

  // If the session being disconnected is the only session connected, then disconnect the wallet in the wallet slice
  async updateConnectedWalletOnDisconnect(topic?: string) {
    const state = store.getState();
    if (!state.walletConnect.sessions.length) {
      await store.dispatch(disconnectWallet("WalletConnect"));
    }

    if (!topic) return
    // If user disconnects the currently selected session, select the next available one
    const sessions = state.walletConnect.sessions
    const selectedSession = state.walletConnect.selectedSession
    if (sessions.length && selectedSession && topic === selectedSession.topic) {
      const newSessionTopic = sessions[sessions.length-1].topic;
      store.dispatch(selectSession(newSessionTopic))
    }
  }

  async connect(): Promise<boolean> {
    return true;
  }

  async connectSession(): Promise<void | SessionTypes.Struct> {  
    // Initiate connection and pass pairing uri to the modal (QR code)
    try {
      const signClient = await this.signClient();
        if (signClient) {
          const namespaces = {
            chia: {
              methods: [
                "chia_createOfferForIds",
                "chia_getWallets",
                'chia_addCATToken',
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
            store.dispatch(setPairingUri(uri))
          }

          // If new connection established successfully
          const session = await approval();
          console.log('Connected Chia wallet via WalletConnect', session, signClient)
          store.dispatch(setPairingUri(null))
          this.detectEvents()

          await this.updateSessions();
          // Update main wallet slice to notify that it is now the active wallet
          await store.dispatch(connectWallet("WalletConnect"))
          return session;
        }
    } catch (error) {
      console.log('Error:', error)
      toast.error(`Wallet - ${error}`)
    }
  }

  disconnect() {
    return true;
  }

  async disconnectSession(topic: string) {
    // Sign client
    const signClient = await this.signClient();
    
    // Fetch previous connection
    try {
        if (!signClient) {
          toast.error('Not connected via WalletConnect or could not sign client')
          return;
        }
        
        // Send request to get Wallets via WalletConnect
        signClient.disconnect({
          topic,
          reason: {
            code: 6000,
            message: "User disconnected."
          },
        });
        
        await this.deleteTopicFromLocalStorage(topic);

        await this.updateSessions();
        await this.updateConnectedWalletOnDisconnect();
      } catch (error: any) {
        // localStorage.removeItem('wc@2:client:0.3//session');
        this.updateSessions();
        console.log(error.message);
    }
  }

  async generateOffer(requestAssets: generateOffer["requestAssets"], offerAssets: generateOffer["offerAssets"], fee: number | undefined): Promise<string | void> {

    // Show modal to user taking them through each step of the process
    const state = store.getState().walletConnect;
    store.dispatch(setRequestStep("getWallets"));
    store.dispatch(setOfferRejected(false));
    // showCompleteWithWalletModal(this)

    var firstRun = true
    var tempAssetsToAddArray: generateOffer["offerAssets"] = [];

    while (firstRun || tempAssetsToAddArray.length > 0) {
      firstRun = false
      tempAssetsToAddArray = []

      // Send request to fetch users wallets
      const wallets = await this.getWallets();
      if (!wallets) {
        store.dispatch(setRequestStep(null))
        return;
      }

      // Match assetIds to users wallet to find the wallet ID (required to send a create offer)

      // For offering assets
      offerAssets.forEach(offerItem => {
        // If item is Chia, set walletId to 1 as this is the default
        if (offerItem.assetId === "") return offerItem.walletId = 1;

        const matchingChiaWallet = wallets.data.find(item => item.meta.assetId === offerItem.assetId);
        if (matchingChiaWallet) {
          offerItem.walletId = matchingChiaWallet.id;
        } else {
          tempAssetsToAddArray.push({...offerItem})
        }
      })

      // For requesting assets
      requestAssets.forEach(requestItem => {
        // If item is Chia, set walletId to 1 as this is the default
        if (requestItem.assetId === "") return requestItem.walletId = 1;

        const matchingChiaWallet = wallets.data.find(item => item.meta.assetId == requestItem.assetId);
        if (matchingChiaWallet) {
          requestItem.walletId = matchingChiaWallet.id;
        } else {
          tempAssetsToAddArray.push({...requestItem})
        }
      })

      if (tempAssetsToAddArray.length) {
        store.dispatch(setUserMustAddTheseAssetsToWallet(tempAssetsToAddArray));
        store.dispatch(setRequestStep("addAssets"));


        // We now have a list of assets which need adding. We keep track of the list length. When it's 0, we can continue as all assets are added.
        const checkIfAssetsHaveBeenAdded = () => {
          return new Promise<void>((resolve, reject) => {
            const unsubscribe = store.subscribe(() => {
              const state = store.getState();
              const userMustAddTheseAssetsToWallet = state.completeWithWallet.userMustAddTheseAssetsToWallet;
              if (userMustAddTheseAssetsToWallet.length === 0 && !state.completeWithWallet.offerRejected) {
                unsubscribe();
                store.dispatch(setRequestStep("getWalletsAgain"));
                resolve();
              } else if (state.completeWithWallet.offerRejected) {
                unsubscribe();
                reject();
              }
              // Still more assets to add, wait for next update & check again
            });
          });
        }

        await checkIfAssetsHaveBeenAdded();
      }      
      
    } // End of while loop (will run twice if user has had to add assets to continue)
    
    store.dispatch(setRequestStep("generateOffer"));
    
    // Generate offer object
    let offer: {[key: number]: number} = {};
    offerAssets.forEach((asset) => {
      if (!asset.walletId) return
      offer[asset.walletId] = -Math.abs(asset.amount);;
    })

    // Generate request object
    let request: {[key: number]: number} = {};
    requestAssets.forEach((asset) => {
      if (!asset.walletId) return
      request[asset.walletId] = asset.amount;
    })

    // Create final object for WalletConnect request
    const compressedOffer = {...offer, ...request}


    // Sign client
    const signClient = await this.signClient();
    
    // Fetch previous connection
    try {
        if (!this.topic || !signClient) {
          toast.error('Not connected via WalletConnect or could not sign client')
          return;
        }

        interface resultOffer {
          error?: {
            data: {
              error: string
              success: boolean
            }
          }
          data?: {
            offer: string
            success: boolean
          }
        }

        // Send request to generate offer via WalletConnect
        const resultOffer: resultOffer = await signClient.request({
          topic: this.topic,
          chainId: "chia:mainnet",
          request: {
            method: "chia_createOfferForIds",
            params: {
              fingerprint: this.selectedFingerprint,
              offer: compressedOffer,
              fee,
              driverDict: {},
              disableJSONFormatting: true,
            },
          },
        });

        if (resultOffer.error) {
          toast.error(resultOffer.error?.data.error)
          // Set offer rejected: true
          store.dispatch(setOfferRejected(true));
        } else if (resultOffer.data) {
          store.dispatch(setRequestStep(null))
          return resultOffer.data.offer;
        }

    } catch (error) {
      toast.error(`Wallet - Failed to generate offer`)
      store.dispatch(setOfferRejected(true));
    }
    
  }

  getBalance(): void {
    // WalletConnect balance retrieval logic
  }

  async getWallets(): Promise<wallets | undefined> {
    // Sign client
    const signClient = await this.signClient();
    
    // Fetch previous connection
    try {
        if (!this.topic || !signClient) {
          toast.error('Not connected via WalletConnect or could not sign client')
          return;
        }
        
        // Send request to get Wallets via WalletConnect
        const request: Promise<wallets> = signClient.request({
          topic: this.topic,
          chainId: "chia:mainnet",
          request: {
            method: "chia_getWallets",
            params: {
              fingerprint: this.selectedFingerprint,
              includeData: true
            },
          },
        });

        toast.promise(request, {
          loading: 'Sent request to your Chia Wallet',
          success: 'Request accepted',
          error: 'Unable to fetch your wallets'
        })
        const wallets = await request;
        
        if (wallets.isSuccess) {
          return wallets;
        } else {
          throw Error('Fetching wallet request unsuccessful')
        }
        
      } catch (error: any) {
      console.log(error.message)
    }
  }

  async addAsset(assetId: string, symbol: string, logo: string, fullName: string): Promise<void> {
    const displayName = `${symbol.includes('TIBET-') ? `TibetSwap Liquidity (${symbol})` : `${fullName} (${symbol})`}`

    // Sign client
    const signClient = await this.signClient();
    
    // Fetch previous connection
    try {
        if (!this.topic || !signClient) {
          toast.error('Not connected via WalletConnect or could not sign client')
          throw Error('Not connected via WalletConnect or could not sign client');
        }

        // Send request to get Wallets via WalletConnect
        const request = signClient.request({
          topic: this.topic,
          chainId: "chia:mainnet",
          request: {
            method: "chia_addCATToken",
            params: {
              fingerprint: this.selectedFingerprint,
              name: displayName,
              assetId: assetId
            },
          },
        });

        toast.promise(request, {
          loading: 'Sent request to your Chia Wallet',
          success: 'Request accepted',
          error: 'Failed to add asset to wallet'
        })
        const response = await request;
        console.log(response)
        return;

    } catch (error: any) {
      console.log(`Wallet - ${error.message}`)
      throw Error(error);
    }
  }

  async getAddress(): Promise<string | null> {
    return null;
    
  }

  async getAllSessions() {
    const signClient = await this.signClient();
    if (signClient) return signClient.session.getAll();
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
      toast.error(`Wallet - ${e}`)
    }
  }

  async detectEvents(): Promise<void> {

    // Sign client
    const signClient = await this.signClient();
    if (!signClient) return


    // If user disconnects from UI or wallet, refresh the page
    signClient.on("session_delete", async ({ id, topic }) => {

      // Check localstorage and ensure it is removed from there
      await this.deleteTopicFromLocalStorage(topic);

      await this.updateSessions();
      await this.updateConnectedWalletOnDisconnect(topic);
    })

  }

}

export default WalletConnectIntegration;
