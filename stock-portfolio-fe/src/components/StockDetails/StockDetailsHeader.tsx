import {
  Card,
  Descriptions,
  Typography,
  Row,
  Col,
  Image,
  Divider,
  Spin,
  Alert,
} from "antd";


const { Title, Text } = Typography;

export const StockHeader: React.FC<{
  image?: string;
  name?: string;
  symbol?: string;
  exchange?: string;
  currency?: string;
}> = ({ image, name, symbol, exchange, currency }) => (
  <Col span={6}>
    <Image
      src={image || "https://via.placeholder.com/100"}
      alt={symbol}
      width={100}
    />
    <Title level={4}>
      {name} ({symbol})
    </Title>
    <Text type="secondary">
      {exchange} • {currency}
    </Text>
  </Col>
);

