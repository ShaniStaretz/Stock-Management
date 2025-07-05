import React from "react";
import { Table, TableColumnType } from "antd";

interface StockData {
  symbol: string;
  name: string;
  price?: number | null;
  change?: number | null;
  changePercent?: number | null;
  exchangeShortName?: string;
  [key: string]: unknown;
}

interface PortfolioTableProps<T extends StockData = StockData> {
  columns: TableColumnType<T>[];
  data: T[];
  loading: boolean;
  searchPage: number;
  searchPageSize: number;
  total: number;
  onPageChange: (page: number, size: number) => void;
}

const PortfolioTable = <T extends StockData = StockData>({
  columns,
  data,
  loading,
  searchPage,
  searchPageSize,
  total,
  onPageChange,
}: PortfolioTableProps<T>) => (
  <Table
    style={{ marginTop: 24 }}
    columns={columns}
    dataSource={data.slice()} // ensure a new array for MobX reactivity
    rowKey="symbol"
    loading={loading}
    pagination={{
      current: searchPage,
      pageSize: searchPageSize,
      total,
      showSizeChanger: true,
      pageSizeOptions: [5, 10, 20, 50],
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      onChange: onPageChange,
    }}
    size="small"
  />
);

export default PortfolioTable;
