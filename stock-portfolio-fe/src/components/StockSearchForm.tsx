import React from "react";
import { Select, Input, Space } from "antd";
import { STOCK_SEARCH_CONFIG } from "./stockSearchColumns";

interface StockSearchFormProps {
  searchSymbol: string;
  selectedExchange: string | undefined;
  exchangeOptions: { value: string; label: string }[];
  isSearching?: boolean;
  onSearchChange: (value: string) => void;
  onExchangeChange: (value: string | undefined) => void;
}

const StockSearchForm: React.FC<StockSearchFormProps> = ({
  searchSymbol,
  selectedExchange,
  exchangeOptions,
  isSearching = false,
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
        suffix={isSearching ? "🔍" : undefined}
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