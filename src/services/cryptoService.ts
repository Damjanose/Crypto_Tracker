// src/services/cryptoService.ts

export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change24h: number;
  iconUri: string;
}

const MAX_RETRIES = 3;

// simple delay helper
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchMarketData(
  ids: string[],
  retries = MAX_RETRIES
): Promise<Crypto[]> {
  if (ids.length === 0) {
    return [];
  }

  const url =
    `https://api.coingecko.com/api/v3/coins/markets` +
    `?vs_currency=usd` +
    `&ids=${ids.join(",")}` +
    `&order=market_cap_desc` +
    `&per_page=100&page=1` +
    `&sparkline=false` +
    `&price_change_percentage=24h`;

  const res = await fetch(url);

  // handle rate-limit
  if (res.status === 429) {
    if (retries > 0) {
      // try to read Retry-After header, fallback to 1s
      const ra = parseInt(res.headers.get("Retry-After") || "1", 10) * 1000;
      console.warn(`Rate limited—retrying after ${ra}ms (${retries} left)`);
      await delay(ra);
      return fetchMarketData(ids, retries - 1);
    }
    throw new Error("Rate limit exceeded. Please try again in a moment.");
  }

  if (!res.ok) {
    throw new Error(`CoinGecko responded with ${res.status}`);
  }

  const data = await res.json();
  return data.map((d: any) => ({
    id: d.id,
    name: d.name,
    symbol: d.symbol.toUpperCase(),
    price: `$${d.current_price.toFixed(2)}`,
    change24h: d.price_change_percentage_24h ?? 0,
    iconUri: d.image,
  }));
}

