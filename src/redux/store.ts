import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import completeWithWalletReducer from './completeWithWalletSlice';
import globalOnLoadDataReducer from './globalOnLoadDataSlice';
import walletConnectReducer from './walletConnectSlice';
import settingsModalReducer from './settingsModalSlice';
import walletReducer from './walletSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from 'redux-persist/lib/storage';
import devFeeReducer from './devFeeSlice';

const rootReducer = combineReducers({
  wallet: walletReducer,
  walletConnect: walletConnectReducer,
  completeWithWallet: completeWithWalletReducer,
  devFee: devFeeReducer,
  settingsModal: settingsModalReducer,
  globalOnLoadData: globalOnLoadDataReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['completeWithWallet', 'settingsModal', 'globalOnLoadDataReducer'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;