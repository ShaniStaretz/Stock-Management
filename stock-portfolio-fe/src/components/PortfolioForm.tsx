import React from "react";
import { Button, Input, Space } from "antd";
import { PORTFOLIO_CONFIG } from "./portfolioColumns";

interface PortfolioFormProps {
  symbol: string;
  name: string;
  quantity: number;
  isEditing: boolean;
  isAddDisabled: boolean;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddStock: () => void;
  onUpdateStock: () => void;
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({
  symbol,
  name,
  quantity,
  isEditing,
  isAddDisabled,
  onQuantityChange,
  onAddStock,
  onUpdateStock,
}) => {
  return (
    <Space style={{ marginBottom: 16, flexWrap: "wrap" }} size="middle">
      <Input
        placeholder="Symbol"
        value={symbol}
        style={{ width: PORTFOLIO_CONFIG.INPUT_WIDTHS.SYMBOL }}
        readOnly
      />
      <Input
        placeholder="Name"
        value={name}
        style={{ width: PORTFOLIO_CONFIG.INPUT_WIDTHS.NAME }}
        readOnly
      />
      <Input
        type="number"
        min={PORTFOLIO_CONFIG.MIN_QUANTITY}
        placeholder="Quantity"
        value={quantity}
        onChange={onQuantityChange}
        style={{ width: PORTFOLIO_CONFIG.INPUT_WIDTHS.QUANTITY }}
      />
      {isEditing ? (
        <Button type="primary" onClick={onUpdateStock}>
          Update Stock
        </Button>
      ) : (
        <Button
          type="primary"
          onClick={onAddStock}
          disabled={isAddDisabled}
        >
          Add Stock
        </Button>
      )}
    </Space>
  );
};

export default PortfolioForm; 