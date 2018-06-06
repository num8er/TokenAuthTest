'use strict';

const config = require('../config');
const crypto = require('crypto');
const crypter = require('./crypter');

class Hasher {
  constructor (secretKey) {
    this._secretKey = secretKey;
  }

  md5 (data) {
    if (!data) data = '';

    return crypto.createHash('md5').update(data.toString()).digest('hex');
  }

  secretMd5 (data) {
    return this.md5(this.md5(data) + this._secretKey);
  }

  saltedMd5 (data, salt) {
    return this.md5(this.md5(data) + salt);
  }

  hash (data) {
    if (!data) data = '';

    return this.secretMd5(crypter.encrypt(data)); // 123456 => crypt aes-256-ctr => md5 + salt
  }

  check (plain, hashed) {
    return this.hash(plain) === hashed;
  }
}

module.exports = new Hasher(config.get('secretKey'));
