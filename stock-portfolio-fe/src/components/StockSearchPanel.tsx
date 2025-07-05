import React from "react";
import { Card } from "antd";
import { observer } from "mobx-react-lite";
import { useStockSearch } from "../hooks/useStockSearch";
import { createStockSearchColumns } from "./stockSearchColumns";
import StockSearchForm from "./StockSearchForm";
import StocksTable from "./StocksTable";
import { IApiStock } from "../types/IApiStock";

const StockSearchPanel: React.FC = () => {
  const {
    searchSymbol,
    selectedExchange,
    searchPage,
    searchPageSize,
    stockStore,
    exchangeOptions,
    handleAddStock,
    handlePageChange,
    handleSearchChange,
    handleExchangeChange,
  } = useStockSearch();

  const columns = createStockSearchColumns(handleAddStock);

  return (
    <Card title="Search Stocks" styles={{ body: { padding: 16 } }}>
      <StockSearchForm
        searchSymbol={searchSymbol}
        selectedExchange={selectedExchange}
        exchangeOptions={exchangeOptions}
        onSearchChange={handleSearchChange}
        onExchangeChange={handleExchangeChange}
      />

      <StocksTable<IApiStock>
        columns={columns}
        data={stockStore.stocks.slice()}
        loading={stockStore.loading}
        searchPage={searchPage}
        searchPageSize={searchPageSize}
        total={stockStore.total}
        onPageChange={handlePageChange}
      />
    </Card>
  );
};

export default observer(StockSearchPanel);
