'use strict';

/**
 * SystemError class
 *
 * @extends Error
 */
class SystemError extends Error {
  constructor (...args) {
    super(...args);
    Error.captureStackTrace(this, SystemError);
  }

  static get statusCode () {
    return 500;
  }

  static get statusText () {
    return 'system';
  }

  static get message () {
    return 'System error happened. Please try again later or contact support.';
  }
}

module.exports = SystemError;
