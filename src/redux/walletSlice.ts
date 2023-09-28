import { createSlice } from '@reduxjs/toolkit';

import { walletNamesType } from '@/utils/walletIntegration/walletIntegrationInterface';

export interface WalletState {
  connectedWallet: walletNamesType["walletNames"] | null;
  address: string | null;
  image: string | null;
  name: string | null;
}

// SLICES
/////////////////////////////////
const initialState: WalletState = {
  connectedWallet: null,
  address: null,
  image: null,
  name: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setConnectedWallet(state, action) {
      if (!action.payload) {
        state.connectedWallet = null;
        state.address = null;
        state.image = null;
        state.name = null;
        return
      }
      state.connectedWallet = action.payload.wallet;
      state.address = action.payload.address;
      state.image = action.payload.image;
      state.name = action.payload.name;
    }
  }
});

export const { setConnectedWallet } = walletSlice.actions;

export default walletSlice.reducer;
