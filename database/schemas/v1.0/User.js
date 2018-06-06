'use strict';

const uuid = require('../../../utils/uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = {
  params: {
    collection: 'users',
    timestamps: true,
    versionKey: false
  },
  fields: {
    _id: {
      type: Schema.Types.String,
      default: uuid.v4
    },
    email: {
      type: Schema.Types.String,
      index: {
        unique: true
      },
      required: true
    },
    password: {
      type: Schema.Types.String,
      required: true
    },
    name: {
      type: Schema.Types.String,
      default: ''
    },
    active: {
      type: Schema.Types.Boolean,
      index: true,
      default: true
    },
    deleted: {
      type: Schema.Types.Boolean,
      index: true,
      default: false
    }
  }
};
