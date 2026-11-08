# NetNapz Play — operator-hosted integration

A standalone, responsive Vercel-deployable app at `apps/netnapz-play` in the NetNapz GitHub repository.

## Scope

- Branded NetNapz Play frontend with two tabs (sportsbook and casino).
- Operator-hosted `iframe` or operator-hosted `redirect` launch.
- **No** storage, handling or processing of player accounts, bets, deposits, withdrawals, player wallets or funds.
- **No real-money gambling** unless a UK-licensed operator has agreed to supply facilities and approved the exact domains/experience.
- Changes in this folder do not replace the existing NetNapz.com homepage or GMX trading app.

## Operator activation checklist

1. Sign a white-label / hosted embed agreement with the operator, including revenue-share economics and technical scope.
2. Operator must approve the NetNapz brand and deployment domain, register the active white-label site as required, and confirm which product(s) it operates.
3. Obtain the **operator-issued** HTTPS hosted URL(s), permitted iframe embedding / redirect policy, legal disclosures, customer protection and UK licence information.
4. Configure `operator.json`:
   - `enabled`: true only after formal live approval.
   - `operatorApproved`: true only when the operator approves NetNapz and launch domains in writing.
   - `operatorName`: approved licensed operator brand.
   - `ukgcAccountNumber`: operator's active UKGC number; verify with UKGC public register.
   - `jurisdiction`: GB.
   - `mode`: `iframe` for operator-supported framing, otherwise `redirect`.
   - `operatorOrigin`: exact HTTPS origin (scheme + hostname) of hosted gambling page(s).
   - `launchUrls.sportsbook` and/or `launchUrls.casino`: full HTTPS **operator-provided** launch pages.
5. Confirm the operator handles player account sign-in, KYC / age checks, AML, deposit/payment processing, betting, withdrawals, GAMSTOP, marketing controls, and safer-gambling requirements.
6. Test login, third-party cookie/session behaviour, cross-origin restrictions, mobile wallets, accessibility, jurisdiction restrictions, operator brand disclosures and the full cashier flow with the operator before launch.
7. If the operator needs per-player signed launch URLs or server-to-server tokens, **do not** place credentials in `operator.json` or frontend. Add an authenticated server-side endpoint reviewed and approved by the operator.

## Deploy
Use Vercel linked to `netnapz/netnapz`, root directory `apps/netnapz-play`. Keep preview on the `feature/netnapz-play-platform` branch. Do not assign `netnapz.com` to this project; it already hosts the existing website. A NetNapz WordPress link to the new project can be added after approval.

## Legal
The UK Gambling Commission holds the **licensee** responsible for all white-label gambling operations and requires due diligence on third parties. A publicly available gambling site, source fork or iframe URL alone does not provide permission to operate a betting brand. See https://www.gamblingcommission.gov.uk/licensees-and-businesses/page/licensees-responsibilities-for-third-parties.
