import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Table, Button, Input, Space, Card } from "antd";
import { useStores } from "../stores/useStores";
import { Link } from "react-router-dom";
import StockActions from "../components/StockActions";

const PortfolioPanel: React.FC = () => {
  const { portfolioStore, authStore } = useStores();
  const [searchPage, setPage] = useState(1);
  const [searchPageSize, setPageSize] = useState(10);

  useEffect(() => {
     if (authStore.loading) return;
    if (!authStore.loading && authStore.user) {
      portfolioStore.fetchPortfolio(searchPage, searchPageSize);
    }
  }, [portfolioStore, searchPage, searchPageSize,  authStore.user,
  authStore.loading,]);

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
            portfolioStore.setEditing(rec.symbol);
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
        {portfolioStore.isEditing ? (
          <Button
            type="primary"
            onClick={() => {
              portfolioStore.updateStock();
              portfolioStore.resetEditing();
            }}
          >
            Update Stock
          </Button>
        ) : (
          <Button type="primary" onClick={() => portfolioStore.addStock()}>
            Add Stock
          </Button>
        )}
      </Space>

      <Table
        columns={columns}
        dataSource={portfolioStore.stocks}
        rowKey="symbol"
        loading={portfolioStore.loading}
        pagination={{
          current: searchPage,
          pageSize: searchPageSize,
          total: portfolioStore.stocks.length,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
          onChange: (page, size) => {
            setPage(page);
            setPageSize(size);
          },
        }}
      />
    </Card>
  );
};

export default observer(PortfolioPanel);
