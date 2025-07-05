import React from "react";
import { Button, Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

interface StockRecord {
  symbol: string;
  name: string;
  quantity: number;
  price?: number;
  change?: number;
  changePercent?: number;
  [key: string]: unknown;
}

interface StockActionsProps {
  record: StockRecord;
  onUpdate: (record: StockRecord) => void;
  onRemove: (symbol: string) => void;
}

const StockActions: React.FC<StockActionsProps> = ({
  record,
  onUpdate,
  onRemove,
}) => {
  const items = [
    {
      key: "update",
      label: "Update",
      onClick: () => onUpdate(record),
    },
    {
      key: "remove",
      label: <span style={{ color: "red" }}>Remove</span>,
      onClick: () => onRemove(record.symbol),
      danger: true,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Button icon={<EllipsisOutlined />} />
    </Dropdown>
  );
};

export default StockActions;
