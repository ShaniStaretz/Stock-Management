import React, { useEffect, useState } from "react";
import { Table, Select, Input, Button, Space, Card } from "antd";
import { observer } from "mobx-react-lite";
import { useStores } from "../stores/useStores";
import { Link } from "react-router-dom";
import { runInAction } from "mobx";

const StockSearchPanel: React.FC = () => {
  const { stockStore, portfolioStore } = useStores();
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
    if (searchSymbol.trim() === "") {
      runInAction(() => {
        stockStore.stocks = [];
      });
      return;
    }
    stockStore.fetchStocks(
      { searchSymbol, selectedExchange },
      searchPageSize,
      searchPage
    );
  }, [searchSymbol, selectedExchange, searchPage, searchPageSize, stockStore]);

  const handleAddStock = (symbol: string, name: string) => {
    portfolioStore.setNewSymbol(symbol);
    portfolioStore.setNewName(name);
  };

  return (
    <Card title="Search Stocks" styles={{ body: { padding: 16 } }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Input
          placeholder="Search Symbol"
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

      <Table
        style={{ marginTop: 24 }}
        columns={[
          {
            title: "Symbol",
            dataIndex: "symbol",
            render: (text: string) => <Link to={`/stock/${text}`}>{text}</Link>,
          },
          { title: "Name", dataIndex: "name" },
          { title: "Exchange", dataIndex: "exchangeShortName" },
          {
            title: "Add",
            render: (_: any, record: any) => (
              <Button
                type="link"
                onClick={() => handleAddStock(record.symbol, record.name)}
              >
                Add
              </Button>
            ),
          },
        ]}
        rowKey="symbol"
        dataSource={stockStore.stocks.slice()}
        loading={stockStore.loading}
        pagination={{
          current: searchPage,
          pageSize: searchPageSize,
          total: stockStore.total,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
          onChange: (page, size) => {
            setSearchPage(page);
            setSearchPageSize(size);
          },
        }}
        size="small"
      />
    </Card>
  );
};

export default observer(StockSearchPanel);
