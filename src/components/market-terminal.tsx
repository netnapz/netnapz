import Link from "next/link";
import { PriceChart } from "@/components/price-chart";
import { AccountPanel, type GmxChainId } from "@/components/account-panel";
import type { MarketSummary, PriceCandle } from "@/lib/gmx/markets";

const products = [
  ["Perpetuals", "Market, limit, stop and trigger orders", "FOUNDATION"],
  ["Swap", "Token swaps and routing", "PLANNED"],
  ["Earn", "GM and GLV liquidity positions", "PLANNED"],
  ["Portfolio", "Positions, orders, trades and PnL", "PLANNED"],
];
const networks = [["Arbitrum", "arbitrum"], ["Avalanche", "avalanche"], ["MegaETH", "megaeth"]];

function marketPath(symbol: string) {
  return symbol.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function requestedPair(selected: string) {
  return selected.split("-").slice(0, 2).join("/");
}

export function MarketTerminal({ markets, candles, chain, chainId, selected }: { markets: MarketSummary[]; candles: PriceCandle[]; chain: string; chainId: GmxChainId; selected: string }) {
  const pair = requestedPair(selected);
  const current = markets.find((market) => market.symbol.toUpperCase().split(" [")[0] === pair) ?? markets[0];
  return (
    <main className="terminal">
      <section className="section-heading"><div><p className="eyebrow">NETNAPZ TRADE TERMINAL</p><h1>Decentralized markets, editorial clarity.</h1><p>All displayed instruments are discovered from the official GMX API for the selected network. Wallet connection is live; transaction signing remains gated while order previews and safety controls are built.</p></div><span className="network"><i />{chain}</span></section>
      <section className="network-picker" aria-label="GMX network">{networks.map(([label, slug]) => <Link className={chain === label ? "selected" : ""} key={slug} href={`/trade/${selected}?network=${slug}`}>{label}</Link>)}</section>
      <section className="capability-strip" aria-label="Product coverage">{products.map(([name, detail, status]) => <article key={name} id={name.toLowerCase()}><div><strong>{name}</strong><span>{detail}</span></div><b>{status}</b></article>)}</section>
      <section className="market-head">
        <div><p className="eyebrow">SELECTED MARKET</p><h2>{current?.symbol ?? pair}</h2></div>
        <div className="market-meta"><span>{markets.length} markets discovered</span><span>Source: GMX SDK</span></div>
      </section>
      <section className="market-picker" aria-label="Available GMX markets">{markets.slice(0, 32).map((market) => {
        const path = marketPath(market.symbol);
        return <Link className={market.address === current?.address ? "selected" : ""} key={market.address} href={`/trade/${path}?network=${chain.toLowerCase()}`}>{market.symbol}</Link>;
      })}</section>
      <section className="workspace">
        <div className="chart-panel panel">
          <div className="panel-title"><span>VERIFIED PRICE SERIES</span><span className="muted">Official GMX hourly OHLCV</span></div>
          <PriceChart candles={candles} />
        </div>
        <aside className="order-panel panel" aria-label="Order ticket preview">
          <div className="ticket-title"><span>ORDER TICKET</span><b>READ ONLY</b></div>
          <div className="direction"><button className="long" disabled>LONG</button><button className="short" disabled>SHORT</button></div>
          {["Order type", "Collateral", "Position size", "Leverage (market maximum)", "Entry estimate", "Liquidation estimate", "Price impact", "Protocol fees"].map((label) => <div className="field" key={label}><span>{label}</span><strong>—</strong></div>)}
          <button className="submit" disabled>PREVIEW NOT YET AVAILABLE</button>
          <p className="risk">The maximum leverage is read per market; the interface will never hard-code 100× where a market permits less. Signing unlocks only after the complete quote and risk preview is verified.</p>
        </aside>
      </section>
      <section className="intelligence panel">
        <div className="panel-title gold-title"><span>NETNAPZ MARKET INTELLIGENCE</span><span>VERIFIED EDITORIAL DATA ONLY</span></div>
        <div className="intel-grid">{["Bias", "Confirmation", "Invalidation", "Catalyst"].map((item) => <article key={item}><p>{item}</p><strong>Awaiting verified analysis</strong></article>)}</div>
      </section>
      <AccountPanel expectedChainId={chainId} />
    </main>
  );
}
