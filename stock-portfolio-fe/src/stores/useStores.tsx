import React, { createContext, useContext } from "react";
import { PortfolioStore } from "./PortfolioStore";
import { StockStore } from "./StockStore";

const storesContext = createContext<{
  portfolioStore: PortfolioStore;
  stockStore: StockStore;
} | null>(null);

export const StoresProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const portfolioStore = new PortfolioStore();
  const stockStore = new StockStore();

  return (
    <storesContext.Provider value={{ portfolioStore,stockStore }}>
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
