const fs = require('fs');
const crypto = require('crypto');

const secretKey = crypto.randomBytes(32).toString('hex');

fs.writeFileSync('secret_key.txt', secretKey, 'utf-8');

console.log('Secret key generated and saved:', secretKey);

module.exports = {
    jwtSecret: secretKey,
};
  