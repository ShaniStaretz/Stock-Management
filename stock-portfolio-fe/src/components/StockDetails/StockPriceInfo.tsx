import {

  Typography,
 
} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";


const { Title,  Text } = Typography;

export const StockPriceInfo: React.FC<{
  price?: number | null;
  changes?: number | null;
  changesPercentage?: number | null;
}> = ({ price, changes, changesPercentage }) => {
  const isPositive =
    changes !== undefined && changes !== null ? changes >= 0 : true;
  return (
    <Title level={2}>
      $
      {price !== undefined && price !== null ? price.toFixed(2) : "N/A"}{" "}
      <Text type={isPositive ? "success" : "danger"}>
        {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}{" "}
        {changes !== undefined && changes !== null
          ? changes.toFixed(2)
          : "N/A"}{" "}
        (
        {changesPercentage !== undefined && changesPercentage !== null
          ? changesPercentage.toFixed(2)
          : "N/A"}
        %)
      </Text>
    </Title>
  );
};