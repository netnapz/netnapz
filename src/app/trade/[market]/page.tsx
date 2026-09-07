import { AppShell } from "@/components/app-shell";
import { MarketTerminal } from "@/components/market-terminal";
import { getGmxChain } from "@/lib/gmx/chains";
import { fetchMarketCatalog, fetchPriceCandles, type MarketSummary, type PriceCandle } from "@/lib/gmx/markets";

export const revalidate = 10;

export default async function TradePage({ params, searchParams }: { params: Promise<{ market: string }>; searchParams: Promise<{ network?: string }> }) {
  const [{ market }, query] = await Promise.all([params, searchParams]);
  const chain = getGmxChain(query.network ?? "arbitrum") ?? getGmxChain("arbitrum")!;
  const selected = market.toUpperCase();
  let markets: MarketSummary[] = [];
  let candles: PriceCandle[] = [];
  let error = false;
  try {
    markets = await fetchMarketCatalog(chain.id);
    const requestedSymbol = selected.split("-").slice(0, 2).join("/");
    candles = await fetchPriceCandles(chain.id, requestedSymbol);
  } catch {
    error = true;
  }

  return <AppShell>{error && <div className="alert" role="alert">Some GMX market data is temporarily unavailable. No cached or fabricated price is being shown.</div>}<MarketTerminal markets={markets} candles={candles} chain={chain.label} selected={selected} /></AppShell>;
}
