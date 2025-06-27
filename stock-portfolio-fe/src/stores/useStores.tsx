import React, { createContext, useContext, useRef } from "react";
import { PortfolioStore } from "./PortfolioStore";
import { StockStore } from "./StockStore";

const storesContext = createContext<{
  portfolioStore: PortfolioStore;
  stockStore: StockStore;
} | null>(null);

export const StoresProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const portfolioStoreRef = useRef<PortfolioStore | null>(null);
  const stockStoreRef = useRef<StockStore | null>(null);

  if (!portfolioStoreRef.current) {
    portfolioStoreRef.current = new PortfolioStore();
  }
  if (!stockStoreRef.current) {
    stockStoreRef.current = new StockStore();
  }

  return (
    <storesContext.Provider
      value={{
        portfolioStore: portfolioStoreRef.current,
        stockStore: stockStoreRef.current,
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
