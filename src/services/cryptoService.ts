export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change24h: number;
  iconUri: string;
}

export interface CoinSearchResult {
  id: string;
  symbol: string;
  name: string;
}

export async function fetchMarketData(ids: string[]): Promise<Crypto[]> {
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

export async function searchCoins(query: string): Promise<CoinSearchResult[]> {
  const q = encodeURIComponent(query.trim());
  const url = `https://api.coingecko.com/api/v3/search?query=${q}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CoinGecko search failed (${res.status})`);
  }
  const body = await res.json();
  return body.coins.map((c: any) => ({
    id: c.id,
    symbol: c.symbol,
    name: c.name,
  }));
}
