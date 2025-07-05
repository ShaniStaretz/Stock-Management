import { IApiStock } from "../types/IApiStock";
import { Link } from "react-router-dom";
import { Button } from "antd";

export const STOCK_SEARCH_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  SEARCH_PLACEHOLDER: "Search by Symbol or Name",
  EXCHANGE_PLACEHOLDER: "Filter by Exchange",
} as const;

export const createStockSearchColumns = (
  onAddStock: (symbol: string, name: string) => void
) => [
  {
    title: "Symbol",
    dataIndex: "symbol",
    render: (text: string) => <Link to={`/stock/${text}`}>{text}</Link>,
  },
  { title: "Name", dataIndex: "name" },
  { title: "Exchange", dataIndex: "exchangeShortName" },
  {
    title: "Add",
    render: (_: unknown, record: IApiStock) => (
      <Button
        type="link"
        onClick={() => onAddStock(record.symbol, record.name)}
      >
        Add
      </Button>
    ),
  },
]; 