import React, { useEffect, useState } from "react";
import { Select, Input, Button, Space, Card } from "antd";
import { observer } from "mobx-react-lite";
import { useStores } from "../stores/useStores";
import { Link } from "react-router-dom";
import { runInAction } from "mobx";
import { IApiStock } from "../types/IApiStock";
import StocksTable from "./StocksTable";

const StockSearchPanel: React.FC = () => {
  const { stockStore, portfolioStore, authStore } = useStores();
  const [searchSymbol, setSearchSymbol] = useState("");
  const [selectedExchange, setSelectedExchange] = useState<
    string | undefined
  >();
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

  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      render: (text: string) => <Link to={`/stock/${text}`}>{text}</Link>,
    },
    { title: "Name", dataIndex: "name" },
    { title: "Exchange", dataIndex: "exchangeShortName" },
    {
      title: "Add",
      render: (_: unknown, record: IApiStock) => (
        <Button
          type="link"
          onClick={() => handleAddStock(record.symbol, record.name)}
        >
          Add
        </Button>
      ),
    },
  ];

  return (
    <Card title="Search Stocks" styles={{ body: { padding: 16 } }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Input
          placeholder="Search by Symbol or Name"
          value={searchSymbol}
          onChange={(e) => setSearchSymbol(e.target.value)}
          allowClear
        />
        <Select
          placeholder="Filter by Exchange"
          value={selectedExchange}
          onChange={setSelectedExchange}
          allowClear
          style={{ width: "100%" }}
          options={exchangeOptions}
        />
      </Space>

      <StocksTable
        columns={columns}
        data={stockStore.stocks.slice()}
        loading={stockStore.loading}
        searchPage={searchPage}
        searchPageSize={searchPageSize}
        total={stockStore.total}
        onPageChange={(page, size) => {
          setSearchPage(page);
          setSearchPageSize(size);
        }}
      />
    </Card>
  );
};

export default observer(StockSearchPanel);
