'use strict';

const {hasher} = require('../../utils');
const {handleError, ForbiddenError} = require('../../errors');
const db = require('../../database');

const AccessToken = db.model('AccessToken');
const User = db.model('User');

const authenticate = async (email, password, ipAddress, rememberMe) => {
  const query = {
    email,
    active: true,
    deleted: false
  };
  const user = await User.findOne(query).lean();

  if (!user || user.password !== hasher.hash(password)) {
    throw new ForbiddenError('User email and/or password invalid');
  }

  const result = await AccessToken.create({
    user: user._id,
    ipAddress,
    rememberMe
  });
  return {token: result._id};
};

module.exports = async (req, res) => {
  try {
    const result = await authenticate(
      req.body.email,
      req.body.password,
      req.realIP,
      req.body.rememberMe
    );
    res.status(200).send(result);
  } catch (error) {
    handleError(error, res);
  }
};
