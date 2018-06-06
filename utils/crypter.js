'use strict';

const config = require('../config');
const crypto = require('crypto');

class Crypter {
  constructor (secretKey, secretKeySalt) {
    this._keychain = {
      key: this.createKey(secretKey, secretKeySalt),
      iv: this.createIV(secretKey, secretKeySalt)
    };
  }

  createKey (secretKey, secretKeySalt) {
    const data = [...secretKeySalt].reverse().join(secretKey);
    return crypto.createHash('md5').update(data).digest('hex');
  }

  createIV (secretKey, secretKeySalt) {
    const data = [...secretKey].reverse().join(secretKeySalt);
    return crypto.createHash('md5').update(data).digest('hex').slice(0, 16);
  }

  get cipher () {
    return crypto.createCipheriv('aes-256-ctr', this._keychain.key, this._keychain.iv);
  }

  get decipher () {
    return crypto.createDecipheriv('aes-256-ctr', this._keychain.key, this._keychain.iv);
  }

  encrypt (data) {
    if (!data) data = '';

    const cipher = this.cipher;
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
  }

  decrypt (data) {
    if (!data) data = '';

    const decipher = this.decipher;
    return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
  }
}

module.exports = new Crypter(config.get('secretKey'), config.get('secretKeySalt'));
