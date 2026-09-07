import Link from "next/link";

const tradeNav = ["Markets", "Trade", "Swap", "Earn", "Pools", "Portfolio", "Orders", "History"];
const siteNav = [
  ["NEWS", "https://netnapz.com/category/news/"],
  ["MARKETS", "https://netnapz.com/markets/"],
  ["ANALYSIS", "https://netnapz.com/category/analysis/"],
  ["TOOLS", "https://netnapz.com/tools/"],
  ["LEARN", "https://netnapz.com/learn/"],
  ["PODCAST", "https://netnapz.com/podcast/"],
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <header className="site-header">
        <div className="utility"><div className="wrap"><Link href="https://netnapz.com">NETNAPZ.COM</Link><span>Institutional crypto intelligence</span><Link href="https://netnapz.com/category/daily-trader-brief/">Daily Trader Brief</Link></div></div>
        <div className="masthead"><div className="wrap masthead-inner">
          <Link className="brand" href="/" aria-label="NetNapz Trade home"><span className="brand-mark">N</span><span className="brand-copy">NETNAPZ <b>TRADE</b><small>INTELLIGENCE MEETS EXECUTION</small></span></Link>
          <button className="wallet" disabled title="Enabled only after security and jurisdiction controls pass">CONNECT WALLET</button>
        </div></div>
        <div className="gold-nav"><div className="wrap"><Link className="home-link" href="https://netnapz.com">HOME</Link>{siteNav.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}<span className="nav-divider" /> <strong>TRADE APP</strong></div></div>
        <div className="trade-nav"><div className="wrap">{tradeNav.map((item) => <Link key={item} className={item === "Trade" ? "active" : ""} href={item === "Trade" ? "/trade/BTC-USD" : `/#${item.toLowerCase()}`}>{item}</Link>)}</div></div>
        <div className="ticker"><div className="wrap"><b>MARKET STATUS</b><span className="status-dot" /> GMX data connected <span>•</span> Arbitrum <span>•</span> Read-only safety mode</div></div>
      </header>
      {children}
      <footer className="site-footer"><div className="wrap footer-grid"><div><div className="footer-brand">NETNAPZ <b>TRADE</b></div><p>Independent market intelligence with GMX-powered execution infrastructure.</p></div><div><b>PLATFORM</b><Link href="/trade/BTC-USD">Trade terminal</Link><Link href="https://netnapz.com/markets/">Markets</Link></div><div><b>IMPORTANT</b><span>Read-only foundation</span><span>Values are never fabricated</span><span>Trading remains disabled</span></div></div><div className="footer-bottom">© NETNAPZ · Built for transparent, risk-aware access to decentralized markets.</div></footer>
    </div>
  );
}
