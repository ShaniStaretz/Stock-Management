import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { IApiStock } from "../types/IApiStock";

export const useStockDetails = (symbol?: string) => {
  const [stock, setStock] = useState<IApiStock | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;
    let isMounted = true;
    setLoading(true);
    setError(null);
    apiClient
      .get(`/stocks/${symbol}`)
      .then((res) => {
        if (!isMounted) return;
        if (res.data) {
          setStock(res.data);
        } else {
          setError("No data found for this symbol");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.response?.data?.message || "Failed to fetch stock data");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [symbol]);

  return { stock, loading, error };
}; 