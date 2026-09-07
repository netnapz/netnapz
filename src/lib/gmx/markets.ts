import { GmxApiSdk } from "@gmx-io/sdk/v2";
import type { GmxChain } from "./chains";

export type MarketSummary = {
  address: string;
  symbol: string;
  updatedAt: number | null;
};

export type PriceCandle = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type RawMarket = Record<string, unknown>;

function stringField(row: RawMarket, ...keys: string[]): string | undefined {
  for (const key of keys) if (typeof row[key] === "string") return row[key];
}

function numberField(row: RawMarket, ...keys: string[]): number | null {
  for (const key of keys) {
    const value = row[key];
    const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

export async function fetchMarketCatalog(chainId: GmxChain["id"]): Promise<MarketSummary[]> {
  const sdk = new GmxApiSdk({ chainId });
  const rows = (await sdk.fetchMarketsInfo()) as unknown as RawMarket[];

  return rows.flatMap((row) => {
    const address = stringField(row, "marketTokenAddress", "marketAddress", "address");
    const symbol = stringField(row, "symbol", "marketSymbol", "name");
    if (!address || !symbol) return [];
    return [{ address, symbol, updatedAt: numberField(row, "updatedAt", "timestamp") }];
  });
}

export async function fetchPriceCandles(chainId: GmxChain["id"], symbol: string): Promise<PriceCandle[]> {
  const sdk = new GmxApiSdk({ chainId });
  const rows = (await sdk.fetchOhlcv({ symbol, timeframe: "1h", limit: 96 })) as unknown as RawMarket[];
  return rows.flatMap((row) => {
    const timestamp = numberField(row, "timestamp", "time");
    const open = numberField(row, "open");
    const high = numberField(row, "high");
    const low = numberField(row, "low");
    const close = numberField(row, "close");
    if (timestamp === null || open === null || high === null || low === null || close === null) return [];
    if ([open, high, low, close].some((value) => value <= 0)) return [];
    return [{ timestamp, open, high, low, close }];
  });
}
