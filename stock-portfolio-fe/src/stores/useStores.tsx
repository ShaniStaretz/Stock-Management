import React, { createContext, useContext } from "react";
import { PortfolioStore } from "./PortfolioStore";

const storesContext = createContext<{ portfolioStore: PortfolioStore } | null>(
  null
);

export const StoresProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const portfolioStore = new PortfolioStore();

  return (
    <storesContext.Provider value={{ portfolioStore }}>
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
