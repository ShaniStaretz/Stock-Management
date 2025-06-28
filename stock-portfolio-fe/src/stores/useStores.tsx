import React, { createContext, useContext, useRef } from "react";
import { PortfolioStore } from "./PortfolioStore";
import { StockStore } from "./StockStore";
import {AuthStore} from './authStore';

export const stores = {
  StockStore,
  PortfolioStore,
  AuthStore,
};
const storesContext = createContext<{
  portfolioStore: PortfolioStore;
  stockStore: StockStore;
  authStore: AuthStore;
} | null>(null);

export const StoresProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const portfolioStoreRef = useRef<PortfolioStore | null>(null);
  const stockStoreRef = useRef<StockStore | null>(null);
    const authStoreRef = useRef<AuthStore | null>(null);

  if (!portfolioStoreRef.current) {
    portfolioStoreRef.current = new PortfolioStore();
  }
  if (!stockStoreRef.current) {
    stockStoreRef.current = new StockStore();
  }

  if (!authStoreRef.current) {
    authStoreRef.current = new AuthStore();
  }

  return (
    <storesContext.Provider
      value={{
        portfolioStore: portfolioStoreRef.current,
        stockStore: stockStoreRef.current,
        authStore: authStoreRef.current,
      }}
    >
      {children}
    </storesContext.Provider>
  );
};

export const useStores = () => {
  const context = useContext(storesContext);
  if (!context) {
    throw new Error("useStores must be used within a StoresProvider");
  }
  return context;
};
