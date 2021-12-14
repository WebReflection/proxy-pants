'use strict';
const {bound} = require('./bound.js');

const {
  ownKeys
} = bound(Reflect);

exports.ownKeys = ownKeys;
