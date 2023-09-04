import WalletIntegrationInterface from '@/utils/walletIntegration/walletIntegrationInterface';
import WalletManager from '@/utils/walletIntegration/walletManager';
import React, { createContext, useState, useEffect } from 'react';

type WalletContextType = {
  walletManager: WalletManager | null;
  activeWallet: WalletIntegrationInterface | null;
  setActiveWallet?: (wallet: WalletIntegrationInterface) => void;
};

const WalletContext = createContext<WalletContextType>({
  walletManager: null,
  activeWallet: null,
  setActiveWallet: () => {},
});

type WalletContextProviderProps = {
  children: React.ReactNode;
};

export const WalletContextProvider: React.FC<WalletContextProviderProps> = ({ children }) => {
  const [walletManager, setWalletManager] = useState<WalletManager | null>(null);
  const [activeWallet, setActiveWallet] = useState<WalletIntegrationInterface | null>(null);

  useEffect(() => {
    setWalletManager(WalletManager.getInstance());

    const setActiveWalletState = async () => {
      setActiveWallet(walletManager ? await walletManager.getActiveWallet() : null);
    };

    setActiveWalletState();
  }, [walletManager]);


  useEffect(() => {
    const handleActiveWalletChange = (wallet: WalletIntegrationInterface | null) => {
      setActiveWallet(wallet);
    };

    if (walletManager) {
      walletManager.registerActiveWalletChangeHandler(handleActiveWalletChange);
    }

    return () => {
      if (walletManager) {
        walletManager.unregisterActiveWalletChangeHandler(handleActiveWalletChange);
      }
    };
  }, [walletManager]);


  return (
    <WalletContext.Provider value={{ walletManager, activeWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;