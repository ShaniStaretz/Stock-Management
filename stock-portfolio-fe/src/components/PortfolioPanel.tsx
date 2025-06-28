import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {  Button, Input, Space, Card, notification } from "antd";
import { useStores } from "../stores/useStores";
import { Link } from "react-router-dom";
import StockActions from "../components/StockActions";
import { IUserStock } from "../types/IUserStock";
import PortfolioTable from "./StocksTable";

const PortfolioPanel: React.FC = () => {
  const { portfolioStore, authStore } = useStores();
  const [searchPage, setPage] = useState(1);
  const [searchPageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (authStore.loading) return;
    if (authStore.user) {
      portfolioStore.fetchPortfolio(searchPage, searchPageSize);
    }
  }, [searchPage, searchPageSize, authStore.user, authStore.loading]);

  const onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 1 || e.target.value === "") {
      portfolioStore.setNewQuantity(value);
    } else {
      notification.error({
        message: "Invalid Quantity",
        description: "Quantity must be at least 1.",
      });
    }
  };

  function isAddStockDisabled(store: typeof portfolioStore) {
    return (
      !store.newSymbol ||
      !/^[A-Z0-9]+$/.test(store.newSymbol) ||
      !store.newName ||
      !store.newQuantity ||
      store.newQuantity < 1
    );
  }

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
      render: (_: unknown, record: IUserStock) => (
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
          style={{ width: 120 }}
          readOnly
        />

        <Input
          placeholder="Name"
          value={portfolioStore.newName}
          style={{ width: 240 }}
          readOnly
        />
        <Input
          type="number"
          min={1}
          placeholder="Quantity"
          value={portfolioStore.newQuantity}
          onChange={onQuantityChange}
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
          <Button
            type="primary"
            onClick={() => portfolioStore.addStock()}
            disabled={isAddStockDisabled(portfolioStore)}
          >
            Add Stock
          </Button>
        )}
      </Space>

      <PortfolioTable
      columns={columns}
      data={portfolioStore.stocks}
      loading={portfolioStore.loading}
      searchPage={searchPage}
      searchPageSize={searchPageSize}
      total={portfolioStore.total}
      onPageChange={(page, size) => {
        setPage(page);
        setPageSize(size);
      }}
    />
    </Card>
  );
};

export default observer(PortfolioPanel);
