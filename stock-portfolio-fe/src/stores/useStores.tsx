import React, { createContext, useContext, useRef } from "react";
import { PortfolioStore } from "./PortfolioStore";
import { StockStore } from "./StockStore";
import authStore from "./authStore";

const portfolioStore = new PortfolioStore(authStore);
const stockStore = new StockStore(authStore);

type StoresContextType = {
  portfolioStore: PortfolioStore;
  stockStore: StockStore;
  authStore: typeof authStore;
};

// Create context
const storesContext = createContext<StoresContextType | null>(null);

// Provider component
export const StoresProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
 
  return (
    <storesContext.Provider
      value={{
        authStore,
        portfolioStore,
        stockStore,
      }}
    >
      {children}
    </storesContext.Provider>
  );
};

// Hook to use the stores in components
export const useStores = () => {
  const context = useContext(storesContext);
  if (!context) {
    throw new Error("useStores must be used within a StoresProvider");
  }
  return context;
};
