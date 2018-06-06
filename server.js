'use strict';

const http = require('http');
const config = require('./config');
const app = require('./app');
const logger = require('./utils/logger');

if (config.get('http:enabled') !== true) {
  logger.warn('Application not allowed to be bound to http listener. Please check configs for environment.');
}

const listenHost = config.get('http:host');
const listenPort = config.get('http:port');
const httpServer = http.createServer(app);

httpServer.listen(listenPort, listenHost,
  () => logger.info('App listening at http://%s:%s', listenHost, listenPort));
