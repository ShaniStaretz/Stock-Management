
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Table, Button, Input, Space } from "antd";
import { useStores } from "../stores/useStores";
import { Link } from "react-router-dom";

const PortfolioPage: React.FC = () => {
  const { portfolioStore } = useStores();

  useEffect(() => {
    portfolioStore.fetchPortfolio(); // load user portfolio on mount
  }, [portfolioStore]);

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
