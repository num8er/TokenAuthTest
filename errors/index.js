'use strict';

// 4xx
module.exports.ValidationError = require('./ValidationError'); // 400, but for diff purpose
module.exports.UnauthorizedError = require('./UnauthorizedError');
module.exports.ForbiddenError = require('./ForbiddenError');
module.exports.NotFoundError = require('./NotFoundError');

// 5xx
module.exports.SystemError = require('./SystemError');

// logical exceptions
module.exports.DeletedEntityError = require('./DeletedEntityError'); // 400
module.exports.DuplicateEntityError = require('./DuplicateEntityError'); // 400

module.exports.handleError = require('./handleError');
