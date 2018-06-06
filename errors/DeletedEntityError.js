'use strict';

class DeletedEntityError extends Error {
  constructor (...args) {
    const message = Array.isArray(args[0]) ? 'Trying to recover deleted entity' : args[0];
    super(message);
    this._messages = Array.isArray(args[0]) ? args[0] : [];
    Error.captureStackTrace(this, DeletedEntityError);
  }

  get messages () {
    return this._messages;
  }

  static get statusCode () {
    return 400;
  }

  static get statusText () {
    return 'deletedEntity';
  }
}

module.exports = DeletedEntityError;
