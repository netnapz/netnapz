"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type EthereumProvider = {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on?(event: string, handler: (...args: unknown[]) => void): void;
  removeListener?(event: string, handler: (...args: unknown[]) => void): void;
};

type WalletState = {
  account: string;
  chainId: number | null;
  busy: boolean;
  message: string;
  connect(): Promise<void>;
};

const WalletContext = createContext<WalletState | null>(null);

function ethereum(): EthereumProvider | undefined {
  return (window as typeof window & { ethereum?: EthereumProvider }).ethereum;
}

function parseChainId(value: unknown): number | null {
  if (typeof value !== "string" || !/^0x[0-9a-f]+$/i.test(value)) return null;
  const parsed = Number.parseInt(value, 16);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const wallet = ethereum();
    const accountsChanged = (...args: unknown[]) => setAccount(((args[0] as string[]) ?? [])[0] ?? "");
    const chainChanged = (...args: unknown[]) => setChainId(parseChainId(args[0]));
    wallet?.on?.("accountsChanged", accountsChanged);
    wallet?.on?.("chainChanged", chainChanged);
    return () => {
      wallet?.removeListener?.("accountsChanged", accountsChanged);
      wallet?.removeListener?.("chainChanged", chainChanged);
    };
  }, []);

  async function connect() {
    const wallet = ethereum();
    if (!wallet) {
      setMessage("Install a compatible self-custody wallet to continue.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const [accounts, network] = await Promise.all([
        wallet.request({ method: "eth_requestAccounts" }) as Promise<string[]>,
        wallet.request({ method: "eth_chainId" }),
      ]);
      setAccount(accounts[0] ?? "");
      setChainId(parseChainId(network));
    } catch {
      setMessage("Wallet connection was cancelled or rejected.");
    } finally {
      setBusy(false);
    }
  }

  const value = useMemo(() => ({ account, chainId, busy, message, connect }), [account, chainId, busy, message]);
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const value = useContext(WalletContext);
  if (!value) throw new Error("useWallet must be used inside WalletProvider");
  return value;
}
