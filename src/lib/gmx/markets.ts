import { GmxApiSdk } from "@gmx-io/sdk/v2";
import type { GmxChain } from "./chains";

export type MarketSummary = {
  address: string;
  symbol: string;
  updatedAt: number | null;
};

type RawMarket = Record<string, unknown>;

function stringField(row: RawMarket, ...keys: string[]): string | undefined {
  for (const key of keys) if (typeof row[key] === "string") return row[key];
}

function numberField(row: RawMarket, ...keys: string[]): number | null {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
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
