import { type generateOffer as generateOfferType, walletClasses } from '@/utils/walletIntegration/walletIntegrationInterface';
import WalletManager from '@/utils/walletIntegration/walletManager';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import { RootState } from './store';

export interface WalletState {
  connectedWallet: keyof typeof walletClasses | null;
  isPending: boolean;
  address: string | null;
  image: string | null;
  name: string | null;
}



// ASYNC
/////////////////////////////////
export const connectWallet = createAsyncThunk('wallet/connectWallet', async (wallet: keyof typeof walletClasses, { getState }) => {
  try {
    const walletManager = new WalletManager();
    await walletManager.connect(wallet);
    const address = await walletManager.getAddress(wallet);
    const image = walletManager.getImage(wallet);
    const name = walletManager.getName(wallet);
    return {
      wallet,
      address,
      image,
      name
    }
  } catch (error: any) {
    if (error.message) {
      toast.error(`Wallet - ${error.message}`);
    }
    throw error;
    // Clear localstorage?
  }
});

export const disconnectWallet = createAsyncThunk('wallet/disconnectWallet', async (wallet: keyof typeof walletClasses) => {
  try {
    const walletManager = new WalletManager();
    await walletManager.disconnect(wallet);
    return wallet;
  } catch (error: any) {
    if (error.message) {
      toast.error(`Wallet - ${error.message}`);
    }
    throw error;
    // Clear localstorage?
  }
});

export const generateOffer = createAsyncThunk('wallet/generateOffer', async (data: {
  requestAssets: generateOfferType["requestAssets"],
  offerAssets: generateOfferType["offerAssets"],
  fee: number | undefined
}, { getState }) => {
  try {
    const state = getState() as RootState;
    const connectedWallet = state.wallet.connectedWallet;
    if (!connectedWallet) throw Error('You must connect a wallet to generate an offer');
    const walletManager = new WalletManager();
    const { requestAssets, offerAssets, fee } = data;
    await walletManager.generateOffer(connectedWallet, requestAssets, offerAssets, fee);
    return connectedWallet;
  } catch (error: any) {
    if (error.message) {
      toast.error(`Wallet - ${error.message}`);
    }
    throw error;
    // Clear localstorage?
  }
});

export const addAsset = createAsyncThunk('wallet/addAsset', async (data: {
  assetId: string,
  symbol: string,
  logo: string,
  fullName: string
}, { getState }) => {
  try {
    const state = getState() as RootState;
    const connectedWallet = state.wallet.connectedWallet;
    if (!connectedWallet) throw Error('You must connect a wallet to add an asset');
    const walletManager = new WalletManager();
    const { assetId, symbol, logo, fullName } = data;
    await walletManager.addAsset(connectedWallet, assetId, symbol, logo, fullName);
    return connectedWallet;
  } catch (error: any) {
    if (error.message) {
      toast.error(`Wallet - ${error.message}`);
    }
    throw error;
    // Clear localstorage?
  }
});

export const detectWalletEvents = createAsyncThunk('wallet/detectWalletEvents', async (_, { getState }) => {

  const state = getState() as RootState;
  if (!state.wallet.connectedWallet) return
  try {
    const walletManager = new WalletManager();
    await walletManager.detectEvents(state.wallet.connectedWallet);
  } catch (error: any) {
    if (error.message) {
      toast.error(`Wallet - ${error.message}`);
    }
    throw error;
  }
});



// SLICES
/////////////////////////////////
const initialState: WalletState = {
  connectedWallet: null,
  isPending: false,
  address: null,
  image: null,
  name: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CONNECT WALLET
      //////////////////////////////////
      .addCase(connectWallet.pending, (state) => {
        state.isPending = true;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.connectedWallet = action.payload.wallet;
        state.address = action.payload.address;
        state.image = action.payload.image;
        state.name = action.payload.name;
        state.isPending = false;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.isPending = false;
      })
      // DISCONNECT WALLET
      //////////////////////////////////
      .addCase(disconnectWallet.pending, (state) => {
        state.isPending = true;
      })
      .addCase(disconnectWallet.fulfilled, (state, action) => {
        state.connectedWallet = null;
        state.isPending = false;
      })
      .addCase(disconnectWallet.rejected, (state, action) => {
        state.isPending = false;
      })
      // GENERATE OFFER
      //////////////////////////////////
      .addCase(generateOffer.pending, (state) => {
        state.isPending = true;
        console.log('Generate offer pending')
      })
      .addCase(generateOffer.fulfilled, (state, action) => {
        state.isPending = false;
        console.log('Generate offer success')
      })
      .addCase(generateOffer.rejected, (state, action) => {
        state.isPending = false;
        console.log('Generate offer error')
      });
  },
});

export const {  } = walletSlice.actions;

export default walletSlice.reducer;
