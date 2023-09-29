import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { generateOffer } from '@/utils/walletIntegration/walletIntegrationInterface';

export interface completeWithWalletSliceState {
  requestStep: null | "getWallets" | "addAssets" | "getWalletsAgain" | "generateOffer";
  userMustAddTheseAssetsToWallet: generateOffer["offerAssets"];
  offerRejected: boolean;
}

// SLICES
/////////////////////////////////
const initialState: completeWithWalletSliceState = {
  requestStep: null,
  userMustAddTheseAssetsToWallet: [],
  offerRejected: false
};

const completeWithWalletSlice = createSlice({
  name: 'completeWithWallet',
  initialState,
  reducers: {
    setRequestStep(state, action: PayloadAction<null | "getWallets" | "addAssets" | "getWalletsAgain" | "generateOffer">) {
      const newStep = action.payload;
      state.requestStep = newStep;
    },

    setUserMustAddTheseAssetsToWallet(state, action: PayloadAction<[] | generateOffer["offerAssets"]>) {
      state.userMustAddTheseAssetsToWallet = action.payload;
    },

    setOfferRejected(state, action: PayloadAction<boolean>) {
      state.offerRejected = action.payload;
    }
  },
});

export const { setRequestStep, setUserMustAddTheseAssetsToWallet, setOfferRejected } = completeWithWalletSlice.actions;

export default completeWithWalletSlice.reducer;
