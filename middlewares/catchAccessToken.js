'use strict';

module.exports = (req, res, next) => {
  if (req.headers.authorization) {
    const [left, right] = req.headers.authorization.split(' ');
    if (left === 'Bearer' && right) {
      req.accessToken = right;
      return next();
    }
  }

  req.accessToken = [
    req.cookies.accessToken,
    req.query.accessToken,
    req.body.accessToken
  ].find(token => typeof token === 'string');

  if (!req.accessToken) {
    delete req.accessToken;
  }

  next();
};
