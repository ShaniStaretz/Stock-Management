import { useEffect, useState } from "react";
import { notification } from "antd";
import { useStores } from "../stores/useStores";
import { validateQuantity, isPortfolioFormValid } from "../utils/validation";
import { IUserStock } from "../types/IUserStock";
import { PORTFOLIO_CONFIG } from "../components/portfolioColumns";

export const usePortfolio = () => {
  const { portfolioStore, authStore } = useStores();
  const [searchPage, setPage] = useState<number>(PORTFOLIO_CONFIG.DEFAULT_PAGE);
  const [searchPageSize, setPageSize] = useState<number>(PORTFOLIO_CONFIG.DEFAULT_PAGE_SIZE);

  useEffect(() => {
    if (authStore.loading) return;
    if (authStore.user) {
      portfolioStore.fetchPortfolio(searchPage, searchPageSize);
    }
  }, [searchPage, searchPageSize, authStore.user, authStore.loading]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (validateQuantity(value) || e.target.value === "") {
      portfolioStore.setNewQuantity(value);
    } else {
      notification.error({
        message: "Invalid Quantity",
        description: "Quantity must be at least 1.",
      });
    }
  };

  const isAddStockDisabled = () => {
    return !isPortfolioFormValid(
      portfolioStore.newSymbol,
      portfolioStore.newName,
      portfolioStore.newQuantity
    );
  };

  const handlePageChange = (page: number, size: number) => {
    setPage(page);
    setPageSize(size);
  };

  const handleUpdateStock = (record: IUserStock) => {
    portfolioStore.setNewSymbol(record.symbol);
    portfolioStore.setNewName(record.name);
    portfolioStore.setNewQuantity(record.quantity);
    portfolioStore.setEditing(record.symbol);
  };

  const handleRemoveStock = (symbol: string) => {
    portfolioStore.removeStock(symbol);
  };

  const handleAddStock = () => {
    portfolioStore.addStock();
  };

  const handleUpdateStockSubmit = () => {
    portfolioStore.updateStock();
    portfolioStore.resetEditing();
  };

  return {
    // State
    portfolioStore,
    searchPage,
    searchPageSize,
    
    // Handlers
    handleQuantityChange,
    handlePageChange,
    handleUpdateStock,
    handleRemoveStock,
    handleAddStock,
    handleUpdateStockSubmit,
    
    // Computed values
    isAddStockDisabled: isAddStockDisabled(),
  };
}; 