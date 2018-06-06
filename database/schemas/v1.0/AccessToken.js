'use strict';

const uuid = require('../../../utils/uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = {
  params: {
    collection: 'access_tokens',
    timestamps: true
  },
  fields: {
    _id: {
      type: Schema.Types.String,
      default: uuid.v4
    },
    user: {
      type: Schema.Types.Object,
      ref: 'User',
      required: true
    },
    ipAddress: {
      type: Schema.Types.String,
      required: true
    },
    rememberMe: {
      type: Schema.Types.Boolean,
      required: false,
      default: false
    }
  }
};
