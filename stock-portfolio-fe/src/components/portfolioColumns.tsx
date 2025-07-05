import React from "react";
import { IUserStock } from "../types/IUserStock";
import { Link } from "react-router-dom";
import StockActions from "./StockActions";
import { TableColumnType } from "antd";

export const PORTFOLIO_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  SYMBOL_REGEX: /^[A-Z0-9]+$/,
  MIN_QUANTITY: 1,
  INPUT_WIDTHS: {
    SYMBOL: 120,
    NAME: 240,
    QUANTITY: 100,
  },
  NAME_MAX_WIDTH: 200,
} as const;

export const createPortfolioColumns = (
  onUpdate: (record: IUserStock) => void,
  onRemove: (symbol: string) => void
): TableColumnType<IUserStock>[] => [
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
          maxWidth: PORTFOLIO_CONFIG.NAME_MAX_WIDTH,
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
        onUpdate={onUpdate}
        onRemove={onRemove}
      />
    ),
  },
]; 