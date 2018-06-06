'use strict';

class DuplicateEntityError extends Error {
  constructor (...args) {
    const message = Array.isArray(args[0]) ? 'Trying to create duplicate entity' : args[0];
    super(message);
    this._messages = Array.isArray(args[0]) ? args[0] : [];
    Error.captureStackTrace(this, DuplicateEntityError);
  }

  get messages () {
    return this._messages;
  }

  static get statusCode () {
    return 400;
  }

  static get statusText () {
    return 'duplicate';
  }
}

module.exports = DuplicateEntityError;
