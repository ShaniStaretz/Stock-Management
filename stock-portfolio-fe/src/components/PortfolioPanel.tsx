import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Table, Button, Input, Space, Card } from "antd";
import { useStores } from "../stores/useStores";
import { Link } from "react-router-dom";
import StockActions from "../components/StockActions";

const PortfolioPanel: React.FC = () => {
  const { portfolioStore } = useStores();

  useEffect(() => {
    portfolioStore.fetchPortfolio();
  }, [portfolioStore]);

  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      render: (text: string) => <Link to={`/stock/${text}`}>{text}</Link>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div
          style={{
            maxWidth: 200,
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        >
          {text}
        </div>
      ),
    },
    { title: "Quantity", dataIndex: "quantity" },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <StockActions
          record={record}
          onUpdate={(rec) => {
            portfolioStore.setNewSymbol(rec.symbol);
            portfolioStore.setNewName(rec.name);
            portfolioStore.setNewQuantity(rec.quantity);
          }}
          onRemove={(symbol) => portfolioStore.removeStock(symbol)}
        />
      ),
    },
  ];

  return (
    <Card title="Your Portfolio">
      <Space style={{ marginBottom: 16, flexWrap: "wrap" }} size="middle">
        <Input
          placeholder="Symbol"
          value={portfolioStore.newSymbol}
          onChange={(e) =>
            portfolioStore.setNewSymbol(e.target.value.toUpperCase())
          }
          style={{ width: 120 }}
          readOnly
        />

        <Input
          placeholder="Name"
          value={portfolioStore.newName}
          onChange={(e) => portfolioStore.setNewName(e.target.value)}
          style={{ width: 240 }}
          readOnly
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
    </Card>
  );
};

export default observer(PortfolioPanel);
