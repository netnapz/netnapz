"use client";

import { useEffect, useState } from "react";

type EthereumProvider = {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on?(event: string, handler: (...args: unknown[]) => void): void;
  removeListener?(event: string, handler: (...args: unknown[]) => void): void;
};

function provider(): EthereumProvider | undefined {
  return (window as typeof window & { ethereum?: EthereumProvider }).ethereum;
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletButton() {
  const [account, setAccount] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const wallet = provider();
    const changed = (...args: unknown[]) => setAccount(((args[0] as string[]) ?? [])[0] ?? "");
    wallet?.on?.("accountsChanged", changed);
    return () => wallet?.removeListener?.("accountsChanged", changed);
  }, []);

  async function connect() {
    const wallet = provider();
    if (!wallet) {
      setMessage("Install a compatible self-custody wallet to continue.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const accounts = await wallet.request({ method: "eth_requestAccounts" }) as string[];
      setAccount(accounts[0] ?? "");
    } catch {
      setMessage("Wallet connection was cancelled or rejected.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="wallet-control">
    <button className="wallet" onClick={connect} disabled={busy} aria-describedby={message ? "wallet-message" : undefined}>
      {busy ? "CONNECTING…" : account ? shortAddress(account) : "CONNECT WALLET"}
    </button>
    {message && <span id="wallet-message" role="status">{message}</span>}
  </div>;
}
