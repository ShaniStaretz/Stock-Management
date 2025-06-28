import React from "react";
import { Table } from "antd";
interface PortfolioTableProps {
  columns: any[];
  data: any[];
  loading: boolean;
  searchPage: number;
  searchPageSize: number;
  total: number;
  onPageChange: (page: number, size: number) => void;
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({
  columns,
  data,
  loading,
  searchPage,
  searchPageSize,
  total,
  onPageChange,
}) => (
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
