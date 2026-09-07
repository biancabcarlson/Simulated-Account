const account = require('./account-data.json');
const relatedAccount = require('./account-data-2.json');

// Backward compatible: `require('simulated-account').profile.name` still
// works. `relatedAccounts` is new: other accounts in this fixture set that
// share PII with the primary account (for duplicate-account / PII-collision
// testing).
module.exports = {
  ...account,
  relatedAccounts: [relatedAccount],
};
