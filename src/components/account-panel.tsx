"use client";

import { GmxApiSdk } from "@gmx-io/sdk/v2";
import { useEffect, useState } from "react";
import { useWallet } from "@/components/wallet-context";

type AccountSnapshot = {
  positions: number;
  orders: number;
  trades: number;
};

export type GmxChainId = 42161 | 43114 | 4326 | 43113 | 421614;

function countCollection(value: unknown): number {
  if (Array.isArray(value)) return value.length;
  if (!value || typeof value !== "object") return 0;
  const row = value as Record<string, unknown>;
  for (const key of ["items", "positions", "orders", "trades", "results", "data"]) {
    if (Array.isArray(row[key])) return row[key].length;
  }
  return 0;
}

export function AccountPanel({ expectedChainId }: { expectedChainId: GmxChainId }) {
  const { account, chainId, connect } = useWallet();
  const [snapshot, setSnapshot] = useState<AccountSnapshot | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!account || chainId !== expectedChainId) return;
    let active = true;
    const sdk = new GmxApiSdk({ chainId: expectedChainId });
    Promise.all([
      sdk.fetchPositionsInfo({ address: account, includeRelatedOrders: true }),
      sdk.fetchOrders({ address: account }),
      sdk.fetchTrades({ address: account, limit: 50 }),
    ]).then(([positions, orders, trades]) => {
      if (!active) return;
      setSnapshot({
        positions: countCollection(positions),
        orders: countCollection(orders),
        trades: countCollection(trades),
      });
      setFailed(false);
    }).catch(() => {
      if (active) setFailed(true);
    });
    return () => { active = false; };
  }, [account, chainId, expectedChainId]);

  if (!account) return <section className="account panel" id="portfolio"><div className="tabs"><b>POSITIONS</b><span>ORDERS</span><span>TRADES</span><span>PORTFOLIO</span></div><div className="account-state"><p>Connect a wallet to load your GMX account.</p><button className="secondary-action" onClick={connect}>CONNECT WALLET</button></div></section>;
  if (chainId !== expectedChainId) return <section className="account panel" id="portfolio"><div className="tabs"><b>POSITIONS</b><span>ORDERS</span><span>TRADES</span><span>PORTFOLIO</span></div><div className="account-state"><p>Your wallet is connected to chain {chainId ?? "unknown"}. Select the matching GMX network in your wallet to load account data.</p></div></section>;
  if (failed) return <section className="account panel" id="portfolio"><div className="tabs"><b>POSITIONS</b><span>ORDERS</span><span>TRADES</span><span>PORTFOLIO</span></div><div className="account-state"><p>GMX account data is temporarily unavailable. No cached account state is shown.</p></div></section>;
  if (!snapshot) return <section className="account panel" id="portfolio" aria-busy="true"><div className="tabs"><b>POSITIONS</b><span>ORDERS</span><span>TRADES</span><span>PORTFOLIO</span></div><div className="account-state"><p>Loading GMX account snapshot…</p></div></section>;

  return <section className="account panel" id="portfolio"><div className="tabs"><b>POSITIONS</b><span>ORDERS</span><span>TRADES</span><span>PORTFOLIO</span></div><div className="account-summary"><article><span>OPEN POSITIONS</span><strong>{snapshot.positions}</strong></article><article><span>ACTIVE ORDERS</span><strong>{snapshot.orders}</strong></article><article><span>RECENT TRADES</span><strong>{snapshot.trades}</strong></article><article><span>WALLET</span><strong>{account.slice(0, 6)}…{account.slice(-4)}</strong></article></div></section>;
}
