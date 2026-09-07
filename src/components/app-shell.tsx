import Link from "next/link";

const nav = ["Markets", "Trade", "Swap", "Earn", "Pools", "Portfolio", "Orders", "History"];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <header className="topbar">
        <Link className="brand" href="/">NETNAPZ <span>TRADE</span></Link>
        <nav aria-label="Primary navigation">
          {nav.map((item) => <Link key={item} href={item === "Trade" ? "/trade/BTC-USD" : `/#${item.toLowerCase()}`}>{item}</Link>)}
        </nav>
        <button className="wallet" disabled title="Wallet support arrives after read-only validation">Connect Wallet</button>
      </header>
      {children}
      <footer>Read-only foundation · Live values are never fabricated · Trading is disabled</footer>
    </div>
  );
}
