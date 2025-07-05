import { useEffect, useState } from "react";
import { runInAction } from "mobx";
import { useStores } from "../stores/useStores";

export const useStockSearch = () => {
  const { stockStore, portfolioStore, authStore } = useStores();
  const [searchSymbol, setSearchSymbol] = useState("");
  const [selectedExchange, setSelectedExchange] = useState<string | undefined>();
  const [searchPage, setSearchPage] = useState(1);
  const [searchPageSize, setSearchPageSize] = useState(10);

  const exchangeOptions = Array.from(
    new Set(stockStore.stocks.map((s) => s.exchangeShortName))
  )
    .filter(Boolean)
    .map((ex) => ({ value: ex, label: ex }));

  useEffect(() => {
    if (authStore.loading) return;
    
    if (!authStore.loading && authStore.user && searchSymbol.trim() !== "") {
      stockStore.fetchStocks(
        { searchSymbol, selectedExchange },
        searchPageSize,
        searchPage
      );
    } else if (!authStore.loading && !authStore.user) {
      runInAction(() => {
        stockStore.stocks = [];
        stockStore.total = 0;
      });
    } else if (searchSymbol.trim() === "") {
      runInAction(() => {
        stockStore.stocks = [];
        stockStore.total = 0;
      });
    }
  }, [
    searchSymbol,
    selectedExchange,
    searchPage,
    searchPageSize,
    stockStore,
    authStore.user,
    authStore.loading,
  ]);

  const handleAddStock = (symbol: string, name: string) => {
    portfolioStore.setNewSymbol(symbol);
    portfolioStore.setNewName(name);
  };

  const handlePageChange = (page: number, size: number) => {
    setSearchPage(page);
    setSearchPageSize(size);
  };

  const handleSearchChange = (value: string) => {
    setSearchSymbol(value);
  };

  const handleExchangeChange = (value: string | undefined) => {
    setSelectedExchange(value);
  };

  return {
    // State
    searchSymbol,
    selectedExchange,
    searchPage,
    searchPageSize,
    stockStore,
    
    // Computed values
    exchangeOptions,
    
    // Handlers
    handleAddStock,
    handlePageChange,
    handleSearchChange,
    handleExchangeChange,
  };
}; 