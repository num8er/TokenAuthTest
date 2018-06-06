'use strict';

const logger = require('../utils/logger');

const DuplicateEntityError = require('./DuplicateEntityError');
const ValidationError = require('./ValidationError');
const UnauthorizedError = require('./UnauthorizedError');
const ForbiddenError = require('./ForbiddenError');
const NotFoundError = require('./NotFoundError');
const SystemError = require('./SystemError');

/**
 * Handles error and responds with appropriate response object.
 * Developed to use with express route handler.
 * Better with try{}.catch(){} blocks.
 *
 * Example:
 *   router.get('/users/:id', async (req, res) => {
 *     try {
 *       const result = await User.findById(req.params.id);
 *       if (!result) throw new ForbiddenError('User not found');
 *       res.status(200).send(result);
 *     }
 *     catch (error) {
 *       handleError(error, res);
 *     }
 *   });
 *
 * @param error
 * @param responseObject
 */
module.exports = (error, responseObject) => {
  switch (error.constructor) {
    case DuplicateEntityError :
    case ValidationError :
    case UnauthorizedError :
    case ForbiddenError :
    case NotFoundError :
      const data = {
        type: error.constructor.statusText,
        message: error.message
      };
      if (error.messages) {
        data.messages = error.messages;
      }
      return responseObject
        .status(error.constructor.statusCode)
        .send(data);
  }

  logger.error(error);
  return responseObject
    .status(SystemError.statusCode)
    .send({
      type: SystemError.statusText,
      message: SystemError.message
    });
};
