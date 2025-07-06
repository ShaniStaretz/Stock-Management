import { useEffect, useState } from "react";
import { runInAction } from "mobx";
import { useStores } from "../stores/useStores";
import { STOCK_SEARCH_CONFIG } from "../components/stockSearchColumns";
import { useDebounce } from "./useDebounce";

export const useStockSearch = () => {
  const { stockStore, portfolioStore, authStore } = useStores();
  const [searchSymbol, setSearchSymbol] = useState("");
  const [selectedExchange, setSelectedExchange] = useState<string | undefined>();
  const [searchPage, setSearchPage] = useState(+STOCK_SEARCH_CONFIG.DEFAULT_PAGE);
  const [searchPageSize, setSearchPageSize] = useState(+STOCK_SEARCH_CONFIG.DEFAULT_PAGE_SIZE);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search symbol to prevent excessive API calls
  const debouncedSearchSymbol = useDebounce(searchSymbol, STOCK_SEARCH_CONFIG.SEARCH_DEBOUNCE_DELAY);
  const debouncedSelectedExchange = useDebounce(selectedExchange, STOCK_SEARCH_CONFIG.EXCHANGE_DEBOUNCE_DELAY);

  const exchangeOptions = Array.from(
    new Set(stockStore.stocks.map((s) => s.exchangeShortName))
  )
    .filter(Boolean)
    .map((ex) => ({ value: ex, label: ex }));

  useEffect(() => {
    if (authStore.loading) return;
    
    // Only search if there's actually a search symbol
    if (!authStore.loading && authStore.user && debouncedSearchSymbol.trim() !== "") {
      setIsSearching(true);
      stockStore.fetchStocks(
        { searchSymbol: debouncedSearchSymbol, selectedExchange: debouncedSelectedExchange },
        searchPageSize,
        searchPage
      ).finally(() => {
        setIsSearching(false);
      });
    } else {
      // Clear results if no search symbol or not authenticated
      runInAction(() => {
        stockStore.stocks = [];
        stockStore.total = 0;
      });
      setIsSearching(false);
    }
  }, [
    debouncedSearchSymbol,
    debouncedSelectedExchange,
    searchPage,
    searchPageSize,
    authStore.user,
    authStore.loading,
    stockStore,
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
    isSearching,
    
    // Computed values
    exchangeOptions,
    
    // Handlers
    handleAddStock,
    handlePageChange,
    handleSearchChange,
    handleExchangeChange,
  };
}; 