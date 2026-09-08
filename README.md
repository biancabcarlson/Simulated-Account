# simulated-account

Synthetic bank account fixture for testing other repos. No real customer, account, or PII.

## Contents

```
simulated-account/
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
- [Report Template Filler](https://biancabcarlson.github.io/Report-Template-Filler/) — write up findings
- [OSINT Tool](https://biancabcarlson.github.io/OSINT-Tool/) — look up the new payee
- [Case Doc Tracker](https://biancabcarlson.github.io/Case-Doc-Tracker/) — track what's still needed
- [Entity Name Matcher](https://biancabcarlson.github.io/Entity-Name-Matcher/) — check name variants
- [Case Timeline Builder](https://biancabcarlson.github.io/Case-Timeline-Builder/) — turn `activityLog` into a chronological writeup

The `index.html` dashboard links to all of these directly from the tool navigation bar at the bottom of the page.
