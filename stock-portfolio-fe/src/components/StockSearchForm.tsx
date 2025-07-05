import React from "react";
import { Select, Input, Space } from "antd";
import { STOCK_SEARCH_CONFIG } from "../constants/stockSearch";

interface StockSearchFormProps {
  searchSymbol: string;
  selectedExchange: string | undefined;
  exchangeOptions: { value: string; label: string }[];
  onSearchChange: (value: string) => void;
  onExchangeChange: (value: string | undefined) => void;
}

const StockSearchForm: React.FC<StockSearchFormProps> = ({
  searchSymbol,
  selectedExchange,
  exchangeOptions,
  onSearchChange,
  onExchangeChange,
}) => {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Input
        placeholder={STOCK_SEARCH_CONFIG.SEARCH_PLACEHOLDER}
        value={searchSymbol}
        onChange={(e) => onSearchChange(e.target.value)}
        allowClear
      />
      <Select
        placeholder={STOCK_SEARCH_CONFIG.EXCHANGE_PLACEHOLDER}
        value={selectedExchange}
        onChange={onExchangeChange}
        allowClear
        style={{ width: "100%" }}
        options={exchangeOptions}
      />
    </Space>
  );
};

export default StockSearchForm; 