import { type generateOffer as generateOfferType } from '@/utils/walletIntegration/walletIntegrationInterface';
import WalletIntegrationInterface from '@/utils/walletIntegration/walletIntegrationInterface';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import WalletManager from '@/utils/walletIntegration/walletManager';
import { toast } from 'react-hot-toast';
import { RootState } from './store';

export interface WalletState {
  connectedWallet: WalletIntegrationInterface | null;
  isPending: boolean;
}



// ASYNC
/////////////////////////////////
export const connectWallet = createAsyncThunk('wallet/connectWallet', async (wallet: WalletIntegrationInterface) => {
  try {
    const walletManager = new WalletManager();
    await walletManager.connect(wallet);
    return wallet;
  } catch (error: any) {
    if (error.message) {
      toast.error(`Wallet - ${error.message}`);
    }
    throw error;
    // Clear localstorage?
  }
});

export const disconnectWallet = createAsyncThunk('wallet/disconnectWallet', async (wallet: WalletIntegrationInterface) => {
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



// SLICES
/////////////////////////////////
const initialState: WalletState = {
  connectedWallet: null,
  isPending: false,
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
        state.connectedWallet = action.payload;
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
