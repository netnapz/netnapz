# NetNapz Trade architecture decision

## Repository finding

The existing root is a legacy Base44-generated Vite/React application with flat JSX files and unresolved `@/pages` / `@/components` imports in the checked-in tree. It has no lockfile, tests, CI, environment example, or deployment workflow. It is not a safe base to mass-convert into financial software.

## Decision

Add NetNapz Trade as an isolated application in `apps/trade`. Preserve every existing root file. A future repository decision can extract this directory into a dedicated repo without rewriting application internals.

## Boundaries

- `src/lib/gmx`: typed GMX read/write adapters. Pages and components never call protocol endpoints directly.
- `src/lib/wallet`: wallet provider, chain switching and account state (Phase C).
- `src/features/*`: vertical product areas once their behavior exceeds presentational components.
- `src/lib/format`: bigint/decimal-safe formatting; no JavaScript floating-point token arithmetic.
- WordPress remains external and read-only to this app through its REST API.
- Transaction writes remain feature-gated until preview, idempotency, receipt/status tracking and jurisdiction gates exist.

## GMX integration decision (verified 2026-09-07)

Use `@gmx-io/sdk` v2 for read-only HTTP data first. Use SDK-exported API support/URL helpers and dynamically fetch market catalogs. Re-evaluate v1 direct writes versus v2 API-relayed writes at the trading phase; each has a different receipt/idempotency model. Do not hard-code contract addresses.
