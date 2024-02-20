import { createSlice } from '@reduxjs/toolkit';

import { walletNamesType } from '@/utils/walletIntegration/walletIntegrationInterface';

export interface WalletState {
  connectedWallet: walletNamesType["walletNames"] | null;
  address: string | null;
  image: string | null;
  name: string | null;
  CNSName: string | null;
}

// SLICES
/////////////////////////////////
const initialState: WalletState = {
  connectedWallet: null,
  address: null,
  image: null,
  name: null,
  CNSName: null,
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
        state.CNSName = null;
        return
      }
      state.connectedWallet = action.payload.wallet;
      state.address = action.payload.address;
      state.image = action.payload.image;
      state.name = action.payload.name;
      state.CNSName = null;
    },
    setCNSName(state, action) {
      state.CNSName = action.payload
    }
  }
});

export const { setConnectedWallet, setCNSName } = walletSlice.actions;

export default walletSlice.reducer;
