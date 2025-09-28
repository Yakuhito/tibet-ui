import type { SessionTypes } from "@walletconnect/types";
import SignClient from "@walletconnect/sign-client";
import Client from '@walletconnect/sign-client';
import { toast } from 'react-hot-toast';

import store from '../../../redux/store';
import WalletIntegrationInterface, { generateOffer } from '../walletIntegrationInterface';

import { setAddress, setConnectedWallet } from '@/redux/walletSlice';
import { connectSession, setPairingUri, selectSession, setSessions, deleteTopicFromFingerprintMemory } from '@/redux/walletConnectSlice';
import { setUserMustAddTheseAssetsToWallet, setOfferRejected, setRequestStep } from '@/redux/completeWithWalletSlice';


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

interface WalletsResponse {
  wallets: wallets | null,
  isSage: boolean
}

const chainId = process.env.NEXT_PUBLIC_XCH === "TXCH" ? "chia:testnet" : "chia:mainnet";

class WalletConnectIntegration implements WalletIntegrationInterface {
  name = "WalletConnect"
  image = "/assets/xch.webp"
  chainId = chainId
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
    try {
      const sessions = await this.getAllSessions();
      if (sessions) {
        store.dispatch(setSessions(sessions));
        return
      } else {
        store.dispatch(setSessions([]))
        store.dispatch(setAddress(null));
        if (store.getState().wallet.connectedWallet === "WalletConnect") store.dispatch(setConnectedWallet(null))
        console.error('No WC sessions found');
      }
    } catch (error: any) {
      if (error.message) {
        console.error(`WalletConnect - ${error.message}`);
      }
      throw error;
    }
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
    if (!state.walletConnect.sessions.length && "WalletConnect" === store.getState().wallet.connectedWallet) {
      store.dispatch(setConnectedWallet(null));
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
                'chia_getCurrentAddress',
                'chia_getNextAddress',
                'chia_getAddress',
                'chia_createOffer'
              ],
              chains: [chainId],
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
          store.dispatch(setPairingUri(null));
          this.detectEvents()

          await this.updateSessions();
          store.dispatch(connectSession(session))
          // Update main wallet slice to notify that it is now the active wallet
          const setConnectedWalletInfo = {
            wallet: "WalletConnect",
            address: null,
            image: session.peer.metadata.icons[0],
            name: "WalletConnect"
          }
          store.dispatch(setConnectedWallet(setConnectedWalletInfo))

          return session;
        }
    } catch (error) {
      console.log('Error:', error);
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
          toast.error('Not connected via WalletConnect or could not sign client', { id: 'failed-to-sign-client' })
          return;
        }
        
        // Send request to get Wallets via WalletConnect
        await signClient.disconnect({
          topic,
          reason: {
            code: 6000,
            message: "User disconnected."
          },
        });
        
        await this.deleteTopicFromLocalStorage(topic);

        await this.updateSessions();
        await this.updateConnectedWalletOnDisconnect();

        // Remove any saved fingerprint preference if any
        store.dispatch(deleteTopicFromFingerprintMemory(topic));

      } catch (error: any) {
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

    let walletsResponse;
    while (firstRun || tempAssetsToAddArray.length > 0) {
      firstRun = false
      tempAssetsToAddArray = []

      // Send request to fetch users wallets
      walletsResponse = await this.getWallets();
      if(!walletsResponse?.isSage) {
          const wallets = walletsResponse?.wallets;
          if (!wallets) {
            store.dispatch(setRequestStep(null))
            return;
          }

          // Match assetIds to users wallet to find the wallet ID (required to send a create offer)

          // For offering assets
          offerAssets.forEach(offerItem => {
            // If item is Chia, set walletId to 1 as this is the default
            if (offerItem.assetId === "") return offerItem.walletId = 1;

            const matchingChiaWallet = wallets!.data.find(item => item.meta.assetId === offerItem.assetId);
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
      }
    
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
          toast.error('Not connected via WalletConnect or could not sign client', { id: 'failed-to-sign-client' })
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

        if(walletsResponse?.isSage) {
          console.log("Sage offer request :)");
          /*
          export interface asset {
              assetId: string
              amount: number
            }

            export interface createOfferParams {
              offerAssets: asset[]
              requestAssets: asset[]
            }
          */
          const resultOffer: {offer: string | undefined, error: string | undefined} = await signClient.request({
            topic: this.topic,
            chainId: chainId,
            request: {
              method: "chia_createOffer",
              params: {
                offerAssets: offerAssets.map(offerItem => ({
                  assetId: offerItem.assetId,
                  amount: offerItem.amount
                } as {assetId: string, amount: number})),
                requestAssets: requestAssets.map(requestItem => ({
                  assetId: requestItem.assetId,
                  amount: requestItem.amount
                } as {assetId: string, amount: number})),
                fee
              },
            },
          })

          if (resultOffer.error) {
            toast.error(resultOffer.error);
            // Set offer rejected: true
            store.dispatch(setOfferRejected(true));
          } else if (resultOffer.offer) {
            store.dispatch(setRequestStep(null));
            return resultOffer.offer;
          }
        }

        // Send request to generate offer via WalletConnect
        const resultOffer: resultOffer = await signClient.request({
          topic: this.topic,
          chainId: chainId,
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
      // toast.error(`Wallet - Failed to generate offer`)
      store.dispatch(setOfferRejected(true));
    }
    
  }

  getBalance(): void {
    // WalletConnect balance retrieval logic
  }

  async getWallets(): Promise<WalletsResponse | undefined> {
    // Sign client
    const signClient = await this.signClient();
    
    // Fetch previous connection
    try {
        if (!this.topic || !signClient) {
          toast.error('Not connected via WalletConnect or could not sign client', { id: 'failed-to-sign-client' })
          return;
        }
        
        try {
          // Send request to get Wallets via WalletConnect
          const request: Promise<wallets> = signClient.request({
            topic: this.topic,
            chainId: chainId,
            request: {
              method: "chia_getWallets",
              params: {
                fingerprint: this.selectedFingerprint,
                includeData: true
              },
            },
          });

          const wallets = await request;
          
          if (wallets.isSuccess) {
            return { isSage: false, wallets };
          } else {
            throw Error('Fetching wallet request unsuccessful')
          }
        } catch (error: any) {
          if(error.code === 4001 && error.message === "Unsupported method: chia_getWallets") {
            return {
              isSage: true,
              wallets: null,
            };
          } else {
            throw error;
          }
        }
        
      } catch (error: any) {
        console.log(error.message)
    }
  }

  async addAsset(assetId: string, symbol: string, logo: string, fullName: string): Promise<void | boolean> {
    const displayName = `${symbol.includes('TIBET-') ? `TibetSwap Liquidity (${symbol})` : `${fullName} (${symbol})`}`

    // Sign client
    const signClient = await this.signClient();
    
    // Fetch previous connection
    try {
        if (!this.topic || !signClient) {
          toast.error('Not connected via WalletConnect or could not sign client', { id: 'failed-to-sign-client' })
          throw Error('Not connected via WalletConnect or could not sign client');
        }

        // Send request to get Wallets via WalletConnect
        const request = signClient.request({
          topic: this.topic,
          chainId: chainId,
          request: {
            method: "chia_addCATToken",
            params: {
              fingerprint: this.selectedFingerprint,
              name: displayName,
              assetId: assetId
            },
          },
        });

        const response = await request;
        return true;

    } catch (error: any) {
      console.log(`Wallet - ${error.message}`)
      throw Error(error);
    }
  }

  async getAddress(): Promise<string | null> {
    console.log("Attempting to get address via WC...")

    let signClient;
    let topic;
    try {
      signClient = await this.signClient();
      const state = store.getState();
      topic = state.walletConnect.selectedSession?.topic
      if (!topic || !signClient) {
        toast.error('Not connected via WalletConnect or could not sign client', { id: 'failed-to-sign-client' })
        throw Error('Not connected via WalletConnect or could not sign client');
      }
      const selectedSession = state?.walletConnect?.selectedSession
      if (!selectedSession) return null
      const fingerprint = state.walletConnect.selectedFingerprint[selectedSession.topic];
      if (!fingerprint) return null
      const wallet_id = selectedSession?.namespaces?.chia?.accounts.findIndex(account => account.includes(fingerprint.toString()));
      console.log(wallet_id)
      if (wallet_id === undefined) return ''
      console.log({
        topic,
        chainId: chainId,
        request: {
          method: "chia_getCurrentAddress",
          params: {
            fingerprint: fingerprint,
            wallet_id,
            new_address: false
          },
        },
      })

      const request = signClient.request<{data: string}>({
        topic,
        chainId: chainId,
        request: {
          method: "chia_getCurrentAddress",
          params: {
            fingerprint: fingerprint,
            wallet_id,
            new_address: false
          },
        },
      });
      const response = await request

      console.log({ addressRequestResponse: response });
      const address = response?.data || null
      if (address) {
        store.dispatch(setAddress(address))
      }
      return address;
    } catch (error: any) {
      if(error.code === 4001 && error.message === "Unsupported method: chia_getCurrentAddress") {
        console.log("Sage detected!");

        const request = (signClient as SignClient).request<{address: string}>({
          topic: topic as string,
          chainId: chainId,
          request: {
            method: "chia_getAddress",
            params: {},
          },
        });
        const response = await request
        
        console.log({ response });
        const address = response.address;
        if (address) {
          store.dispatch(setAddress(address))
        }
        return address;
      }
      console.error(error)
      return null
    }
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
      // await this.deleteTopicFromLocalStorage(topic);
      await this.updateSessions();
      await this.updateConnectedWalletOnDisconnect(topic);
    })

  }

}

export default WalletConnectIntegration;
