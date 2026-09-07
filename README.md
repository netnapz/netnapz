# NETNAPZ TRADE

Standalone NetNapz trading application for `trade.netnapz.com`, powered by official GMX SDK/API integrations and connected to the existing WordPress editorial platform at `netnapz.com`.

## Safety status

This initial replacement is deliberately read-only. Wallet writes, approvals and order submission stay disabled until preview calculations, duplicate-submit protection, transaction tracking, monitoring and jurisdiction controls are verified.

No UI fee or referral code is configured.

## Local development

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

Copy `.env.example` to `.env.local` when configuration is required. Never commit credentials, RPC secrets, API secrets, private keys or seed phrases.

## Delivery path

1. Dynamic GMX markets, tickers, capacity and OHLCV.
2. Wallet connection, network switching, balances and allowances.
3. Typed previews and transparent fees.
4. Guarded approval and order workflows.
5. Positions, related orders, history and portfolio.
6. NetNapz WordPress intelligence integration.
7. Security, accessibility, mobile, monitoring and regulatory release gates.
