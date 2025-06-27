import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Table, Button, Input, Space, Select } from "antd";
import { useStores } from "../stores/useStores";
import { Link } from "react-router-dom";

const PortfolioPage: React.FC = () => {
  const { portfolioStore, stockStore } = useStores();
  const [searchSymbol, setSearchSymbol] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (searchSymbol === "") {
      stockStore.stocks = [];
      return;
    }
    stockStore.fetchStocks(searchSymbol);
  }, [searchSymbol, stockStore]);

  useEffect(() => {
    return () => {
      stockStore.stocks = [];
    };
  }, [stockStore]);

  useEffect(() => {
    portfolioStore.fetchPortfolio(); // load user portfolio on mount
  }, [portfolioStore]);

  const handleSelectSymbol = (value: string) => {
    setSelectedSymbol(value);
    const stock = stockStore.stocks.find((s) => s.symbol === value);
    if (stock) {
      portfolioStore.setNewSymbol(stock.symbol);
      portfolioStore.setNewName(stock.name);
    }
  };

  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (text: string) => <Link to={`/stock/${text}`}>{text}</Link>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Button
          danger
          onClick={() => portfolioStore.removeStock(record.symbol)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Your Portfolio</h1>
      <Space style={{ marginBottom: 16 }}>
        <Select
          showSearch
          value={selectedSymbol}
          placeholder="Search Symbol"
          style={{ width: 200 }}
          defaultActiveFirstOption={false}
          filterOption={false}
          onSearch={setSearchSymbol}
          onChange={handleSelectSymbol}
          notFoundContent={
            searchSymbol && stockStore.loading ? "Loading..." : null
          }
          options={stockStore.stocks.map((stock) => ({
            value: stock.symbol,
            label: `${stock.symbol} - ${stock.name}`,
          }))}
        />
      </Space>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Symbol"
          value={portfolioStore.newSymbol}
          onChange={(e) =>
            portfolioStore.setNewSymbol(e.target.value.toUpperCase())
          }
          style={{ width: 120 }}
        />
        <Input
          placeholder="Name"
          value={portfolioStore.newName}
          onChange={(e) => portfolioStore.setNewName(e.target.value)}
          style={{ width: 240 }}
        />
        <Input
          type="number"
          min={1}
          placeholder="Quantity"
          value={portfolioStore.newQuantity}
          onChange={(e) =>
            portfolioStore.setNewQuantity(Number(e.target.value))
          }
          style={{ width: 100 }}
        />
        <Button type="primary" onClick={() => portfolioStore.addStock()}>
          Add Stock
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={portfolioStore.stocks.slice()}
        rowKey="symbol"
        loading={portfolioStore.loading}
      />
    </div>
  );
};

export default observer(PortfolioPage);
