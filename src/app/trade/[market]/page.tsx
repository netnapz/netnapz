import { AppShell } from "@/components/app-shell";
import { MarketTerminal } from "@/components/market-terminal";
import { getGmxChain } from "@/lib/gmx/chains";
import { fetchMarketCatalog, type MarketSummary } from "@/lib/gmx/markets";

export const revalidate = 10;

export default async function TradePage({ params, searchParams }: { params: Promise<{ market: string }>; searchParams: Promise<{ network?: string }> }) {
  const [{ market }, query] = await Promise.all([params, searchParams]);
  const chain = getGmxChain(query.network ?? "arbitrum") ?? getGmxChain("arbitrum")!;
  let markets: MarketSummary[] = [];
  let error = false;
  try { markets = await fetchMarketCatalog(chain.id); } catch { error = true; }

  return <AppShell>{error && <div className="alert" role="alert">GMX market data is temporarily unavailable. No cached price is being shown.</div>}<MarketTerminal markets={markets} chain={chain.label} selected={market.toUpperCase()} /></AppShell>;
}
