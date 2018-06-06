'use strict';

const logger = require('../../utils/logger');
const db = require('../../database');

const AccessToken = db.model('AccessToken');

const destroyAccessToken = async (accessToken) => {
  try {
    await AccessToken.findByIdAndRemove(accessToken);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = (req, res) => {
  destroyAccessToken(req.accessToken);
  res.status(200).send({});
};
