import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import walletReducer, { WalletState } from './walletSlice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    wallet: walletReducer,
  },
});

export default store;

export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;