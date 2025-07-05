import React from "react";
import { observer } from "mobx-react-lite";
import { Card } from "antd";
import { usePortfolio } from "../hooks/usePortfolio";
import { createPortfolioColumns } from "../constants/portfolio";
import PortfolioTable from "./StocksTable";
import PortfolioForm from "./PortfolioForm";

const PortfolioPanel: React.FC = () => {
  const {
    portfolioStore,
    searchPage,
    searchPageSize,
    handleQuantityChange,
    handlePageChange,
    handleUpdateStock,
    handleRemoveStock,
    handleAddStock,
    handleUpdateStockSubmit,
    isAddStockDisabled,
  } = usePortfolio();

  const columns = createPortfolioColumns(handleUpdateStock, handleRemoveStock);

  return (
    <Card title="Your Portfolio">
      <PortfolioForm
        symbol={portfolioStore.newSymbol}
        name={portfolioStore.newName}
        quantity={portfolioStore.newQuantity}
        isEditing={portfolioStore.isEditing}
        isAddDisabled={isAddStockDisabled}
        onQuantityChange={handleQuantityChange}
        onAddStock={handleAddStock}
        onUpdateStock={handleUpdateStockSubmit}
      />

      <PortfolioTable
        columns={columns}
        data={portfolioStore.stocks}
        loading={portfolioStore.loading}
        searchPage={searchPage}
        searchPageSize={searchPageSize}
        total={portfolioStore.total}
        onPageChange={handlePageChange}
      />
    </Card>
  );
};

export default observer(PortfolioPanel);
