import React from "react";
import { Button, Dropdown, Menu, Space } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

interface StockActionsProps {
  record: any;
  onUpdate: (record: any) => void;
  onRemove: (symbol: string) => void;
}

const StockActions: React.FC<StockActionsProps> = ({ record, onUpdate, onRemove }) => {
  const menu = (
    <Menu>
      <Menu.Item key="update" onClick={() => onUpdate(record)}>
        Update
      </Menu.Item>
      <Menu.Item key="remove" danger onClick={() => onRemove(record.symbol)}>
        Remove
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button icon={<EllipsisOutlined />} />
    </Dropdown>
  );
};

export default StockActions;