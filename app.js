'use strict';

process.env.serviceName = require('./package.json').name;

// LOADING NECESSARY PACKAGES & COMPONENTS
require('./database').connect();
const config = require('./config');
const middlewares = require('./middlewares');
const express = require('express');
const app = express();

// APPLICATION BOOTSTRAP
app.set('trust proxy', 1);
app.use(middlewares.cors());
app.get('/', (req, res) => res.status(200).send('Token Auth Service'));
app.use(middlewares.cookieParser());
app.use(middlewares.bodyParser.json());
app.use(middlewares.bodyParser.urlencoded({extended: false}));
if (config.get('logger:request:enabled') === true) {
  const logger = require('./utils/logger');
  app.use(logger.request);
}
app.use(middlewares.catchRealIP);
app.use(middlewares.catchAccessToken);
app.use(require('./routes'));

module.exports = app;
