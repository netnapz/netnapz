"use client";

import { useWallet } from "@/components/wallet-context";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletButton() {
  const { account, busy, message, connect } = useWallet();
  return <div className="wallet-control">
    <button className="wallet" onClick={connect} disabled={busy} aria-describedby={message ? "wallet-message" : undefined}>
      {busy ? "CONNECTING…" : account ? shortAddress(account) : "CONNECT WALLET"}
    </button>
    {message ? <span id="wallet-message" role="status">{message}</span> : null}
  </div>;
}
