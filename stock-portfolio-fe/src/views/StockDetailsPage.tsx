import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import apiClient from "../api/apiClient";
import { IApiStock } from "../types/IApiStock";

const { Title, Paragraph, Text, Link } = Typography;

const StockDetailPage = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [stock, setStock] = useState<IApiStock | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    apiClient
      .get(`/stocks/${symbol}`)
      .then((res) => {
        if (res.data) {
          setStock(res.data);
        } else {
          setError("No data found for this symbol");
        }
      })
      .catch(() => setError("Failed to fetch stock data"))
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) return <Spin tip="Loading stock data..." />;
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;
  if (!stock) return null;

  const {
    name,
    price,
    changes,
    changesPercentage,
    marketCap,
    sector,
    industry,
    exchange,
    currency,
    image,
    dayLow,
    dayHigh,
    yearLow,
    yearHigh,
    previousClose,
    open,
    volume,
    avgVolume,
    beta,
    pe,
    eps,
    lastDiv,
    sharesOutstanding,
    ceo,
    fullTimeEmployees,
    ipoDate,
    address,
    city,
    state,
    zip,
    website,
    earningsAnnouncement,
    description,
    symbol: stockSymbol,
  } = stock;

  const isPositive = changes !== undefined && changes !== null ? changes >= 0 : true;

  return (
    <Card style={{ margin: 20 }}>
      <button
        style={{
          marginBottom: 16,
          padding: "6px 16px",
          borderRadius: 4,
          border: "1px solid #d9d9d9",
          background: "#fff",
          cursor: "pointer",
        }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Image
            src={image || "https://via.placeholder.com/100"}
            alt={stockSymbol || symbol}
            width={100}
          />
          <Title level={4}>
            {name} ({stockSymbol || symbol})
          </Title>
          <Text type="secondary">
            {exchange} • {currency}
          </Text>
        </Col>

        <Col span={18}>
          <Title level={2}>
            ${price !== undefined && price !== null ? price.toFixed(2) : "N/A"}{" "}
            <Text type={isPositive ? "success" : "danger"}>
              {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}{" "}
              {changes !== undefined && changes !== null
                ? changes.toFixed(2)
                : "N/A"}{" "}
              ({changesPercentage !== undefined && changesPercentage !== null
                ? changesPercentage.toFixed(2)
                : "N/A"}
              %)
            </Text>
          </Title>

          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Day Range">
              ${dayLow !== undefined && dayLow !== null ? dayLow : "N/A"} - $
              {dayHigh !== undefined && dayHigh !== null ? dayHigh : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="52w Range">
              ${yearLow !== undefined && yearLow !== null ? yearLow : "N/A"} - $
              {yearHigh !== undefined && yearHigh !== null ? yearHigh : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Open">
              ${open !== undefined && open !== null ? open : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Previous Close">
              ${previousClose !== undefined && previousClose !== null ? previousClose : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Volume">
              {volume !== undefined && volume !== null
                ? volume.toLocaleString()
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Avg Volume">
              {avgVolume !== undefined && avgVolume !== null
                ? avgVolume.toLocaleString()
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Market Cap">
              {marketCap !== undefined && marketCap !== null
                ? `$${(marketCap / 1e9).toFixed(2)}B`
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Beta">
              {beta !== undefined && beta !== null ? beta : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="P/E Ratio">
              {pe !== undefined && pe !== null ? pe : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="EPS">
              {eps !== undefined && eps !== null ? `$${eps}` : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Dividend">
              {lastDiv !== undefined && lastDiv !== null ? `$${lastDiv}` : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Outstanding Shares">
              {sharesOutstanding !== undefined && sharesOutstanding !== null
                ? sharesOutstanding.toLocaleString()
                : "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col span={12}>
          <Descriptions title="Company Info" bordered column={1} size="small">
            <Descriptions.Item label="CEO">{ceo || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Employees">
              {fullTimeEmployees !== undefined && fullTimeEmployees !== null
                ? fullTimeEmployees
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="IPO Date">{ipoDate || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Sector">{sector || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Industry">{industry || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Address">
              {[address, city, state, zip].filter(Boolean).join(", ") || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Website">
              {website ? (
                <Link href={website} target="_blank" rel="noopener noreferrer">
                  {website}
                </Link>
              ) : (
                "N/A"
              )}
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col span={12}>
          <Descriptions title="Upcoming" bordered column={1} size="small">
            <Descriptions.Item label="Next Earnings">
              {earningsAnnouncement
                ? new Date(earningsAnnouncement).toLocaleString()
                : "N/A"}
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">About</Divider>
          <Paragraph ellipsis={{ rows: 6, expandable: true, symbol: "more" }}>
            {description || "No description available."}
          </Paragraph>
        </Col>
      </Row>
    </Card>
  );
};

export default StockDetailPage;