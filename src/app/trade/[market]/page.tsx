import { AppShell } from "@/components/app-shell";
import { MarketTerminal } from "@/components/market-terminal";
import { getGmxChain } from "@/lib/gmx/chains";
import { fetchMarketCatalog, fetchPriceCandles, type MarketSummary, type PriceCandle } from "@/lib/gmx/markets";

export const revalidate = 10;

export default async function TradePage({ params, searchParams }: { params: Promise<{ market: string }>; searchParams: Promise<{ network?: string }> }) {
  const [{ market }, query] = await Promise.all([params, searchParams]);
  const chain = getGmxChain(query.network ?? "arbitrum") ?? getGmxChain("arbitrum")!;
  const selected = market.toUpperCase();
  const requestedSymbol = selected.split("-").slice(0, 2).join("/");
  let markets: MarketSummary[] = [];
  let candles: PriceCandle[] = [];
  let marketError = false;
  let priceError = false;

  try {
    markets = await fetchMarketCatalog(chain.id);
  } catch {
    marketError = true;
  }
  try {
    candles = await fetchPriceCandles(chain.id, requestedSymbol);
  } catch {
    priceError = true;
  }

  return <AppShell>
    {marketError && <div className="alert" role="alert">GMX market catalogue is temporarily unavailable. No substitute markets are shown.</div>}
    {priceError && <div className="alert" role="alert">GMX price history is temporarily unavailable. No cached or fabricated price is shown.</div>}
    <MarketTerminal markets={markets} candles={candles} chain={chain.label} chainId={chain.id} selected={selected} />
  </AppShell>;
}
