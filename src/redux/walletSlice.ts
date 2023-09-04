// redux/walletSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the wallet state type
export interface WalletState {
  walletConnected: boolean;
  // Add more wallet-related state properties as needed
}

const initialState: WalletState = {
  walletConnected: false,
  // Initialize other wallet-related state properties here
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connectWallet: (state) => {
      state.walletConnected = true;
    },
    disconnectWallet: (state) => {
      state.walletConnected = false;
    },
    // Add more actions and reducers for wallet state
  },
});

export const { connectWallet, disconnectWallet } = walletSlice.actions;

export default walletSlice.reducer;
