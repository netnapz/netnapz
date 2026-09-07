# GMX production integration matrix

Canonical sources:

- https://docs.gmx.io/llms.txt
- https://docs.gmx.io/llms-full.txt
- https://docs.gmx.io/docs/api/integration-guide/
- https://docs.gmx.io/docs/api/frontend-integration/
- https://docs.gmx.io/docs/sdk/v2/

This matrix is the release contract for NetNapz Trade. A feature is only marked live after implementation, automated tests, browser verification, observability, security review, and the relevant legal release gate. Unknown or stale financial data must fail closed.

## Current foundation

| Area | State |
| --- | --- |
| NetNapz visual shell | Live |
| GMX market discovery | Live, read-only |
| Network and market selection | Live, read-only |
| Wallet connection | Live, no transaction signing |
| Hourly OHLCV chart | Live, display-only |
| Trade submission | Locked |

## GMX API operations

### Orders and collateral

- [ ] Prepare increase, decrease and swap orders
- [ ] Submit signed orders
- [ ] Fetch request/order status
- [ ] Edit order preparation and submission
- [ ] Cancel order preparation and submission
- [ ] Collateral preparation
- [ ] Approval transaction preparation
- [ ] Duplicate-submit prevention using persisted request IDs
- [ ] Receipt/relay polling with unknown treated as inconclusive
- [ ] Market, limit, stop-loss, take-profit and TWAP flows
- [ ] Classic, Express and One-Click modes

### Markets and pricing

- [x] Market catalogue/info
- [x] OHLCV candles
- [ ] Market config
- [ ] Market values and freshness enforcement
- [ ] Market tickers
- [ ] JIT-aware long/short trading capacity
- [ ] Tokens and token prices
- [ ] Pairs
- [ ] Market open/closed/unknown state
- [ ] Rates and historical funding/borrowing
- [ ] Oracle API peer/fallback reads
- [ ] API peer failover across gmxapi.io and gmxapi.ai
- [ ] Timeout, 429 and 5xx exponential backoff

### Accounts

- [ ] Wallet balances
- [ ] Router allowances
- [ ] Positions with related orders in one coherent snapshot
- [ ] Position detail
- [ ] Account-wide active orders
- [ ] Order detail
- [ ] Trades and advanced trade search
- [ ] Post-write reconciliation
- [ ] Transfer history

### Earn, pools and tokenomics

- [ ] APY by 1d, 7d, 30d, 90d, 180d, 1y and total
- [ ] Performance annualized
- [ ] Performance snapshots
- [ ] GM pool fee yield and trader PnL
- [ ] GM deposits and withdrawals
- [ ] GLV deposits, withdrawals and shifts
- [ ] GM/GLV pricing with documented valuation source
- [ ] Liquidity history and current liquidity
- [ ] GMX staking power
- [ ] Weekly buyback statistics
- [ ] Rewards and claims

### GMX Account and multichain

- [ ] Same-chain deposit and withdrawal
- [ ] Cross-chain deposit preparation/execution
- [ ] Cross-chain withdrawal preparation/signing/submission
- [ ] Cross-chain withdrawal status
- [ ] Ethereum, Base and BNB funding into Arbitrum settlement
- [ ] Stargate liquidity-cap handling
- [ ] Transfer recovery and status UI

### Delegated and One-Click trading

- [ ] Generate and encrypt scoped subaccount key
- [ ] Owner approval
- [ ] Chain/account-scoped storage
- [ ] Expiry and action-count enforcement
- [ ] Relay nonce tracking
- [ ] Revocation and local data removal
- [ ] Smart-wallet typed-data compatibility fallback
- [ ] Never expose or transmit unencrypted delegated keys

### Commercial configuration

- [ ] Optional UI-fee receiver
- [ ] On-chain UI-fee factor validation
- [ ] UI-fee disclosure in every preview
- [ ] Optional registered referral code
- [ ] Referral owner and validator checks
- [ ] Preserve an existing trader referral
- [ ] Never disguise referral changes

## Contract and data surfaces

- [ ] ExchangeRouter
- [ ] Reader
- [ ] GlvReader
- [ ] GlvRouter
- [ ] SimulationRouter
- [ ] EventEmitter monitoring
- [ ] DataStore fee/config reads
- [ ] Contract-address registry by chain
- [ ] GraphQL indexed history
- [ ] Known-issues controls
- [ ] Contract simulation before supported writes

## Production release gates

- [ ] Exact bigint arithmetic for transaction values
- [ ] Slippage and acceptable-price limits
- [ ] Liquidation and after-all-fees preview
- [ ] Per-market leverage tiers; never blanket 100x
- [ ] TradFi on/off-hours risk changes
- [ ] Accessibility and keyboard testing
- [ ] Responsive browser verification
- [ ] Error telemetry and API health monitoring
- [ ] Content Security Policy and security headers
- [ ] Dependency and supply-chain review
- [ ] Independent smart-contract integration review
- [ ] Incident and rollback runbook
- [ ] Privacy/cookie review
- [ ] Terms and risk disclosures
- [ ] Jurisdiction-specific release controls
- [ ] WordPress navigation and trade.netnapz.com DNS
- [ ] Vercel production-domain verification

## Non-negotiable operational rules

1. Never display fabricated financial values.
2. Check freshness timestamps before use.
3. Never calculate transaction amounts with JavaScript floating-point numbers.
4. Persist request/task identifiers before polling.
5. Never blindly resubmit when relay status is unknown.
6. Expect read-after-write lag across relay, keeper and indexer layers.
7. Prefer composite coherent snapshots over joining unrelated polling cycles.
8. Never request a seed phrase or private key.
9. Keep all transaction signing user-consented and inspectable.
10. Do not enable a jurisdiction until its release gate is approved.
