'use strict';

const hasher = require('../../utils').hasher;
const {handleError, DeletedEntityError, DuplicateEntityError} = require('../../errors');
const db = require('../../database');

const AccessToken = db.model('AccessToken');
const User = db.model('User');

const createUser = async (email, password, name) => {
  const user = await User.findOne({email});
  if (!user) return User.create({email, password, name});
  if (user.deleted) throw new DeletedEntityError('Recovering deleted profile not allowed');
  if (user.active) throw new DuplicateEntityError('Profile already exists');
  user.set({active: true});
  await user.save();
  return user;
};

module.exports = async (req, res) => {
  try {
    const [email, password, name] = [
      req.body.email,
      req.body.password,
      req.body.name
    ];
    const user = await createUser(email, hasher.hash(password), name);
    const {_id: token} = await AccessToken.create({
      user: user._id,
      ipAddress: req.realIP,
      rememberMe: true
    });
    res.status(201).send({token});
  } catch (error) {
    handleError(error, res);
  }
};
