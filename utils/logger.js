'use strict';

const winston = require('winston');
const SentryTransport = require('winston-sentry');
const ConsoleTransport = winston.transports.Console;

const config = require('../config');

const transports = [];
const exceptionHandlers = [];

// Transport for logging to console
const consoleTransport = new ConsoleTransport({
  level: 'debug',
  colorize: true,
  humanReadableUnhandledException: true,
  timestamp: true
});
transports.push(consoleTransport);
exceptionHandlers.push(consoleTransport);

// Here goes custom transports
if (config.get('env') !== 'test') { // test environment should not use custom transports
  if (config.get('logger:sentry:enabled') === true) {
    const sentrySettings = config.get('logger:sentry:settings');
    sentrySettings.tags.serviceName = process.env.serviceName ? process.env.serviceName : 'not provided';
    const setryTransport = new SentryTransport(sentrySettings);
    transports.push(setryTransport);
    exceptionHandlers.push(setryTransport);
  }
}

// Creating logger instance
const
  logger = new winston.Logger({
    transports,
    exitOnError: true
  });

// Handling Unhandled Exceptions
logger.handleExceptions(exceptionHandlers);

if (config.get('logger:request:enabled') === true) {
  const morgan = require('morgan');
  logger.request = morgan(
    config.get('logger:request:mode'),
    {
      stream: {
        write: logger.info
      }
    }
  );
}

module.exports = logger;
