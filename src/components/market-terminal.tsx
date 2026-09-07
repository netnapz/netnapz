import type { MarketSummary } from "@/lib/gmx/markets";

export function MarketTerminal({ markets, chain, selected }: { markets: MarketSummary[]; chain: string; selected: string }) {
  const current = markets.find((market) => market.symbol.toUpperCase().includes(selected.split("-")[0])) ?? markets[0];
  return (
    <main className="terminal">
      <section className="market-head">
        <div><p className="eyebrow">MARKET</p><h1>{current?.symbol ?? selected.replace("-", "/")}</h1></div>
        <span className="network"><i />{chain}</span>
      </section>
      <section className="workspace">
        <div className="chart-panel panel">
          <div className="panel-title"><span>Chart</span><span className="muted">Live chart integration: Phase B</span></div>
          <div className="chart-empty"><strong>Market data connected</strong><span>{markets.length} GMX markets discovered dynamically</span></div>
        </div>
        <aside className="order-panel panel" aria-label="Order ticket preview">
          <div className="direction"><button className="long" disabled>Long</button><button className="short" disabled>Short</button></div>
          {["Collateral", "Position size", "Leverage", "Entry estimate", "Liquidation estimate", "Price impact", "Protocol fees"].map((label) => <div className="field" key={label}><span>{label}</span><strong>—</strong></div>)}
          <button className="submit" disabled>Trading disabled</button>
          <p className="risk">Wallet writes remain off until read paths, previews, receipt handling and jurisdiction controls are validated.</p>
        </aside>
      </section>
      <section className="intelligence panel">
        <div className="panel-title"><span>NETNAPZ MARKET INTELLIGENCE</span><span className="muted">Editorial API: Phase G</span></div>
        <div className="intel-grid">{["Bias", "Confirmation", "Invalidation", "Catalyst"].map((item) => <article key={item}><p>{item}</p><strong>Awaiting verified analysis</strong></article>)}</div>
      </section>
      <section className="account panel"><div className="tabs"><b>Positions</b><span>Orders</span><span>Trades</span><span>Portfolio</span></div><p>No wallet connected</p></section>
    </main>
  );
}
