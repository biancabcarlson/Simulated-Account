# Simulated-Account

Synthetic bank account fixture for testing other repos. No real customer, account, or PII.

## Contents

```
Simulated-Account/
├── account-data.json     # primary account fixture (Jane Doe)
├── account-data-2.json   # second account that reuses the primary's retired PII
├── index.html    # visual reference for the data
├── index.js            # entry point, exports account-data.json + relatedAccounts
├── package.json
└── README.md
```

## Usage

### Node

```js
const account = require('simulated-account');
// or, without installing as a package:
const account = require('./account-data.json');

console.log(account.profile.name);        // "Jane Doe"
console.log(account.achTransactions[0]);  // most recent ACH transaction
console.log(account.relatedAccounts[0].profile.name); // "Janet R. Doe" — second account, shares PII with the primary
```

### Python

```python
import json

with open("account-data.json") as f:
    account = json.load(f)

print(account["profile"]["name"])
```

### Visual reference

Open `index.html` in a browser to see the same data rendered as a tabbed dashboard (home, payment methods, ACH history, crypto activity, login/IP log, KYC, security, documents).

### Add evidence to the timeline

Every account-activity, ACH, crypto, login/IP, and security-review item has
an **Add to timeline** action. It opens a review composer with the evidence
text, date/time, time-known status, and source/context. The reviewed item is
sent directly to Timeline Builder through the browser-local
`investigatorSuiteTimelineInbox` queue; no clipboard paste is required.
Timeline Builder imports it automatically and stores custom events under
`investigatorSuiteTimelineEvents`.

This handoff is live when the tools are hosted under the same origin, such as
the GitHub Pages layout represented by this repository. It is intentionally a
static-demo workflow: the queue is not a server-side case record and is not
shared across different browsers or investigators.

### Privacy Mode

A "🔒 Privacy Mode" toggle (top right) blurs every field tagged as PII — name, account/card/routing numbers, wallet addresses, phone, email, residential address, DOB, IP addresses, and the ID-verification modal — without hiding the page structure, so the layout can be screen-shared or demoed without exposing (simulated) customer data. State is shared across every tool in the suite via `localStorage` (`investigatorSuitePrivacyMode`), so toggling it here also toggles it in Documents Folder, Case Calculator, etc.

### Case Role

A **View as** selector sits next to Privacy Mode, shared the same way (`investigatorSuiteRole`), with three roles: **Customer Service**, **Fraud Investigator**, and **Lead / Manager**. Customer Service is read-only for case decisions; Fraud Investigator and Lead / Manager can additionally resolve a fraud flag under Security → Flagged Events. The **Mark resolved** button stays clickable for Customer Service — clicking it pops up "You are currently viewing as: Customer Service. Only investigators and managers can complete this action" instead of just being disabled, so the restriction is explained rather than silent.

### Case Activity

The Security tab includes a "Case Activity" feed (`investigatorSuiteActivity` in `localStorage`) that logs every case decision made in *any* tool in the suite — e.g. rejecting a document in Documents Folder shows up here without opening that tool. This is a real shared log, not just cross-links: it updates live across open tabs via the `storage` event.

**Limitation to know:** all of the above is `localStorage`, which is per-browser, not per-person. Two investigators on two different machines won't see each other's role or activity — it demonstrates the pattern, not a real multi-user permission system.

## Data structure

| Key | Contents |
|---|---|
| `profile` | Name, account number, phone, email, address, status |
| `activityLog` | Non-transactional events — account creation, KYC, ACH linking, address/email changes, 2FA setup, beneficiary changes |
| `paymentMethods` | Linked bank accounts, cards, crypto wallets |
| `achTransactions` | Deposits/withdrawals, including a returned (R01) and a pending transaction |
| `cryptoActivity` | Buys/sells/transfers across BTC/ETH/USDC, including one transaction flagged for review |
| `loginLog` | Login attempts, including a failed lockout from a foreign IP and an incomplete MFA challenge |
| `security` | KYC status (incl. residential address, DOB, authorized users), 2FA config, trusted devices, risk/review flags |
| `documents` | Statements, tax documents |

## Edge cases included

- Returned ACH transaction (R01 — insufficient funds)
- Pending ACH withdrawal to a newly added external payee (flagged, unresolved)
- Crypto withdrawal to an address added the same day (flagged, later cleared)
- Failed-login lockout followed by an incomplete MFA challenge, then a later successful login from the same non-US IP after the 2FA method was downgraded
- 2FA method self-service downgrade (SMS → email) shortly before the anomalous login (open risk flag)
- New external payee added the same week as a large pending withdrawal (open risk flag)
- Removed card, still visible in payment method history
- Open risk flags with no resolution (`resolvedOn: null`)
- **PII collision across accounts** (`account-data-2.json`): a second account, "Janet R. Doe," was opened the same night as the primary account's anomalous login, from the same IP (185.220.101.47, Bucharest). It reuses the primary account's *retired* phone number ((415) 555-0119, replaced a month earlier) and *retired* email (j.doe88@example.com, retired a year earlier) at the same street address — a duplicate-account / synthetic-identity pattern where an attacker recycles a victim's old contact details to pass a new account's PII checks.

## Extending

- Additional test accounts: duplicate `account-data.json`'s structure with new values (e.g. `account-data-3.json`), and add it to the `relatedAccounts` array in `index.js`.
- Different edge cases: add or edit array entries in the relevant section — each row is independent, no cross-references to break.
- Mock API endpoint instead of a static file: not yet implemented.

## Used alongside

This fixture is designed to be worked as a practice case with the investigator tool series:

- [Case Calculator](https://biancabcarlson.github.io/Case-Calculator/) — check the exposure/mitigation math on the flagged withdrawal
- [Report Builder](https://biancabcarlson.github.io/Report-Builder/) — write up findings
- [OSINT Assistant](https://biancabcarlson.github.io/OSINT-Assistant/) — look up the new payee
- [Documents Folder](https://biancabcarlson.github.io/Documents-Folder/) — track what's still needed
- [Entity Match](https://biancabcarlson.github.io/Entity-Match/) — check name variants
- [Timeline Builder](https://biancabcarlson.github.io/Timeline-Builder/) — turn `activityLog` into a chronological writeup

The `index.html` dashboard links to all of these directly from the tool navigation bar at the bottom of the page.
