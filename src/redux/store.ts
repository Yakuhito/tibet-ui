import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import walletReducer, { WalletState } from './walletSlice'; // Import your walletSlice

// Define the root state type
export interface RootState {
  wallet: WalletState;
}

const store = configureStore({
  reducer: {
    wallet: walletReducer,
  },
});

export default store;

export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
