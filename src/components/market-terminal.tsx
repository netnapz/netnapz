import type { MarketSummary } from "@/lib/gmx/markets";

const products = [
  ["Perpetuals", "Market, limit, stop and trigger orders", "FOUNDATION"],
  ["Swap", "Token swaps and routing", "PLANNED"],
  ["Earn", "GM pools and liquidity positions", "PLANNED"],
  ["Portfolio", "Positions, orders, trades and PnL", "PLANNED"],
];

export function MarketTerminal({ markets, chain, selected }: { markets: MarketSummary[]; chain: string; selected: string }) {
  const current = markets.find((market) => market.symbol.toUpperCase().includes(selected.split("-")[0])) ?? markets[0];
  return (
    <main className="terminal">
      <section className="section-heading"><div><p className="eyebrow">NETNAPZ TRADE TERMINAL</p><h1>Decentralized markets, editorial clarity.</h1><p>GMX market discovery is live. Transaction signing stays locked until previews, receipts, risk disclosures and jurisdiction controls are independently verified.</p></div><span className="network"><i />{chain}</span></section>
      <section className="capability-strip" aria-label="Product coverage">{products.map(([name, detail, status]) => <article key={name} id={name.toLowerCase()}><div><strong>{name}</strong><span>{detail}</span></div><b>{status}</b></article>)}</section>
      <section className="market-head">
        <div><p className="eyebrow">SELECTED MARKET</p><h2>{current?.symbol ?? selected.replace("-", "/")}</h2></div>
        <div className="market-meta"><span>{markets.length} markets discovered</span><span>Source: GMX SDK</span></div>
      </section>
      <section className="workspace">
        <div className="chart-panel panel">
          <div className="panel-title"><span>PRICE & MARKET DEPTH</span><span className="muted">Chart and orderbook connection in progress</span></div>
          <div className="chart-empty"><div className="chart-badge">LIVE MARKET CATALOGUE</div><strong>{markets.length} GMX markets discovered dynamically</strong><span>No synthetic prices or placeholder candles are shown.</span></div>
        </div>
        <aside className="order-panel panel" aria-label="Order ticket preview">
          <div className="ticket-title"><span>ORDER TICKET</span><b>READ ONLY</b></div>
          <div className="direction"><button className="long" disabled>LONG</button><button className="short" disabled>SHORT</button></div>
          {["Order type", "Collateral", "Position size", "Leverage", "Entry estimate", "Liquidation estimate", "Price impact", "Protocol fees"].map((label) => <div className="field" key={label}><span>{label}</span><strong>—</strong></div>)}
          <button className="submit" disabled>TRADING DISABLED</button>
          <p className="risk">Wallet writes will only be enabled after transaction simulation, slippage limits, receipt tracking, security review and legal controls are complete.</p>
        </aside>
      </section>
      <section className="intelligence panel">
        <div className="panel-title gold-title"><span>NETNAPZ MARKET INTELLIGENCE</span><span>VERIFIED EDITORIAL DATA ONLY</span></div>
        <div className="intel-grid">{["Bias", "Confirmation", "Invalidation", "Catalyst"].map((item) => <article key={item}><p>{item}</p><strong>Awaiting verified analysis</strong></article>)}</div>
      </section>
      <section className="account panel" id="portfolio"><div className="tabs"><b>Positions</b><span id="orders">Orders</span><span id="history">Trades</span><span>Portfolio</span></div><p>No wallet connected. Account-specific data is not requested until consent is given.</p></section>
    </main>
  );
}
