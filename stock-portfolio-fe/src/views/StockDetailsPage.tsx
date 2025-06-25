import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Alert } from "antd";
import apiClient from "../api/apiClient";

interface StockQuote {
  symbol: string;
  price: number;
  changesPercentage: number;
  name: string;
}


const StockDetailsPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    setLoading(true);
    setError(null);

    apiClient
      .get(`/stocks/${symbol}`)
      .then((res) => {
        if (res.data.length > 0) {
          setQuote(res.data[0]);
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

  if (!quote) return null;

  return (
    <Card
      title={`${quote.name} (${quote.symbol})`}
      style={{ maxWidth: 400, margin: "auto" }}
    >
      <p>
        <strong>Price:</strong> ${quote.price.toFixed(2)}
      </p>
      <p>
        <strong>Change Today:</strong>{" "}
        <span style={{ color: quote.changesPercentage >= 0 ? "green" : "red" }}>
          {quote.changesPercentage.toFixed(2)}%
        </span>
      </p>
    </Card>
  );
};

export default StockDetailsPage;
