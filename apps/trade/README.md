# NETNAPZ TRADE

Isolated, production-oriented trading application for `trade.netnapz.com`. This directory does not replace the legacy Vite/Base44 application or the WordPress editorial site.

## Current scope

- Next.js/TypeScript application shell and responsive terminal design system.
- Read-only GMX SDK v2 market discovery on Arbitrum, Avalanche, and MegaETH.
- Explicit loading, stale/unavailable, and disabled-write states.
- Bigint-safe unit formatting and unit tests.
- No wallet connection, approvals, transaction construction, referral code, or UI fee.

## Run locally

```bash
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

Copy `.env.example` to `.env.local` only when configuration is needed. Never commit `.env*` secrets.

## Delivery sequence

1. Validate dynamic market, ticker, token, capacity and OHLCV reads with freshness metadata and peer failover.
2. Add a production wallet layer and network switching; keep trading disabled.
3. Add typed order previews, simulation and transparent fee breakdowns.
4. Add approval/order writes with duplicate-submit guards and lifecycle persistence.
5. Add positions, related orders, history and portfolio.
6. Integrate NetNapz editorial intelligence via the WordPress REST API.
7. Complete security, accessibility, mobile, monitoring and regulatory release gates.

Production activation is blocked pending technical/security QA and a documented UK legal/regulatory decision.
