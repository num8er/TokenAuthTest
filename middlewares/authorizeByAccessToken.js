'use strict';

const db = require('../database');
const AccessToken = db.model('AccessToken');

const handleError = require('../errors/handleError');
const Unauthorized = require('../errors/UnauthorizedError');
const Forbidden = require('../errors/ForbiddenError');

module.exports = async (req, res, next) => {
  try {
    if (!req.accessToken) throw new Unauthorized('Access token not defined');

    const result = await AccessToken.findById(req.accessToken).populate('user', '-password');
    if (!result) throw new Forbidden('Access token not found');
    if (!result.user) throw new Forbidden('User account not found');
    if (result.user.deleted === true || result.user.active === false) throw new Forbidden('User account disabled');

    req.user = result.user;
    req.userId = result.user._id;

    result.set({updatedAt: Date.now()});
    result.save(() => {});

    next();
  } catch (error) {
    handleError(error, res);
  }
};
