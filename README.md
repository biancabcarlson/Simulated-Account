# simulated-account

Synthetic bank account fixture for testing other repos. No real customer, account, or PII.

## Contents

```
simulated-account/
├── account-data.json   # the fixture data
├── index.html    # visual reference for the data
├── index.js            # entry point, exports account-data.json
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
```

### Python

```python
import json

with open("account-data.json") as f:
    account = json.load(f)

print(account["profile"]["name"])
```

### Visual reference

Open `index.html` in a browser to see the same data rendered as a tabbed dashboard (home, payment methods, ACH history, crypto activity, login/IP log, security & KYC, documents).

## Data structure

| Key | Contents |
|---|---|
| `profile` | Name, account number, phone, email, address, status |
| `activityLog` | Non-transactional events — account creation, KYC, ACH linking, address/email changes, 2FA setup, beneficiary changes |
| `paymentMethods` | Linked bank accounts, cards, crypto wallets |
| `achTransactions` | Deposits/withdrawals, including a returned (R01) and a pending transaction |
| `cryptoActivity` | Buys/sells/transfers across BTC/ETH/USDC, including one transaction flagged for review |
| `loginLog` | Login attempts, including a failed lockout from a foreign IP and an incomplete MFA challenge |
| `security` | KYC status, 2FA config, trusted devices, risk/review flags |
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

## Extending

- Additional test accounts: duplicate `account-data.json`'s structure with new values (e.g. `account-data-2.json`), and export both from `index.js`.
- Different edge cases: add or edit array entries in the relevant section — each row is independent, no cross-references to break.
- Mock API endpoint instead of a static file: not yet implemented.

## Used alongside

This fixture is designed to be worked as a practice case with the investigator tool series:

- [Case Calculator](https://biancabcarlson.github.io/Case-Calculator/) — check the exposure/mitigation math on the flagged withdrawal
- [Report Template Filler](https://biancabcarlson.github.io/Report-Template-Filler/) — write up findings
- [OSINT Query Fanout](https://biancabcarlson.github.io/OSINT-Query-Fanout/) — look up the new payee
- [Case Doc Tracker](https://biancabcarlson.github.io/Case-Doc-Tracker/) — track what's still needed
- [Entity Name Matcher](https://biancabcarlson.github.io/Entity-Name-Matcher/) — check name variants
- [Case Timeline Builder](https://biancabcarlson.github.io/Case-Timeline-Builder/) — turn `activityLog` into a chronological writeup

The `index.html` dashboard links to all of these directly from its Security & KYC tab and footer.
