# NETNAPZ DEX RADAR

A **separate**, independent NetNapz-branded on-chain scanner concept, built on its own Git branch (`netnapz-dex-radar`) and intended for a dedicated Vercel deployment. It does **not** modify or import source from NetNapzTrade, the NetNapz homepage, or any live WordPress property.

## First release — implemented

- Dark, responsive DEX pool scanner, initially optimised for Solana, with Base / Ethereum / Arbitrum / BNB Chain / Polygon selectors.
- Volume, trending, recent pools, liquidity, and indexed Pump ecosystem filters.
- Pool-level price, 5-minute / 1-hour / 24-hour changes, liquidity, transactions, token addresses and age (only when the data provider actually has those fields).
- Canvas OHLC chart generated exclusively from the selected pool's API candles.
- Search within the displayed pool results, favorites persisted in the browser, and 45-second refresh while visible.
- External **Buy / Sell** routes to Jupiter (Solana), PancakeSwap (BNB), or Uniswap (other listed EVM chains), with token mint copy. **Swaps happen on those services, not within Radar.**
- Token launch preparation and a link to the **official Pump.fun create page**. **Token creation is performed on Pump.fun, not within Radar.**
- Honest provider / freshness / security notices and no simulated prices, wallets, orders, or token launches.

## Market data

Serverless GET-only `/api/market` proxies documented public DexPaprika endpoints. Set `DEXPAPRIKA_API_KEY` in Vercel if required by the upstream plan; never expose it in the browser. Free-tier availability, rate limits and freshness are controlled by the provider. We display errors rather than inventing market data. The provider's source and timestamp accompany every response. This is **not** a real-time trading or execution feed.

## Future integrations, **not currently implemented**

- Native noncustodial Solana wallet connection, current Jupiter Swap API V2 quote / sign / execute flow with slippage and mint verification.
- Pump.fun bonding-curve token indexing and direct swaps, where supported by official SDK and data providers.
- Secure Pump.fun token-launch transactions inside the app.
- Wallet token balances, token security analysis from verified providers, notifications and chart streaming.

No funds are accepted, no private keys are handled, and no on-chain transactions are initiated in this release.

## Git & deployment

All files are under `dex-radar/` on the `netnapz-dex-radar` branch of `netnapz/netnapz`. Target an **unused** Vercel project with `rootDirectory: dex-radar`; do not deploy to or rename a project used by netnapz.com, trade.netnapz.com, or active WordPress sites.

- `index.html`: scanner UI.
- `style.css`: responsive interface.
- `app.js`: read-only client and outbound trade/launch routes.
- `api/market.js`: audited read-only API endpoint with a fixed upstream host and network whitelist.

Tokens can lose all value; never regard a market listing as an endorsement.