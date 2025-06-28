import React from "react";
import { Button, Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

interface StockActionsProps {
  record: any;
  onUpdate: (record: any) => void;
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
