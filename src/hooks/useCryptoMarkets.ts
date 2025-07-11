// src/hooks/useCryptoMarkets.ts
import { useCallback, useEffect, useState } from "react";
import { fetchMarketData, Crypto } from "../services/cryptoService";

export function useCryptoMarkets(coinIds: string[]) {
  const [coins, setCoins]     = useState<Crypto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchMarketData(coinIds);
      setCoins(data);
    } catch (e: any) {
      console.error("Market fetch failed", e);
      setError("Unable to load prices.");
    } finally {
      setLoading(false);
    }
  }, [coinIds]);

  // auto‐fetch on mount & when coinIds change
  useEffect(() => {
    reload();
  }, [reload]);

  return { coins, loading, error, reload };
}
