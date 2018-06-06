'use strict';

const express = require('express');
const router = express.Router();

const {validate, authorizeByAccessToken} = require('../middlewares');
const Joi = require('joi');

const AuthController = require('../controllers/Auth');
const UserController = require('../controllers/Users');

router.get(
  '/profile',
  authorizeByAccessToken,
  (req, res) => res.status(200).send(req.user));

router.post(
  '/register',
  validate({
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().required()
    }
  }),
  UserController.create);

router.post(
  '/login',
  (req, res, next) => {
    if (req.body.rememberMe) req.body.rememberMe = true;
    next();
  },
  validate({
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      rememberMe: Joi.boolean()
    }
  }),
  AuthController.attempt);

router.delete('/', AuthController.destroy);
router.get('/logout', AuthController.destroy);

module.exports = router;
