import { useEffect, useState, useRef } from "react";
import apiClient from "../api/apiClient";
import { IApiStock } from "../types/IApiStock";

export const useStockDetails = (symbol?: string) => {
  const [stock, setStock] = useState<IApiStock | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!symbol) return;
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    let isMounted = true;
    setLoading(true);
    setError(null);
    setStock(null);
    
    apiClient
      .get(`/stocks/${encodeURIComponent(symbol)}`, {
        signal: abortControllerRef.current.signal
      })
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
        // Don't set error if request was aborted
        if (err.name !== 'AbortError') {
          setError(err?.response?.data?.message || "Failed to fetch stock data");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
      
    return () => {
      isMounted = false;
      // Abort request on cleanup
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [symbol]);

  return { stock, loading, error };
}; 