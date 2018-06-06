'use strict';

module.exports.cookieParser = require('cookie-parser');
module.exports.bodyParser = require('body-parser');
module.exports.cors = require('cors');
module.exports.validate = require('./validate');
module.exports.catchAccessToken = require('./catchAccessToken');
module.exports.authorizeByAccessToken = require('./authorizeByAccessToken');
module.exports.catchRealIP = require('./catchRealIP');
