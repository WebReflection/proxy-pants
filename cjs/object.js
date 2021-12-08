'use strict';
const {bound} = require('./bound.js');
const {caller} = require('./function.js');

const {
  freeze,
  getOwnPropertyDescriptor,
  getPrototypeOf
} = bound(Object);

const {hasOwnProperty} = caller({});

exports.freeze = freeze;
exports.getOwnPropertyDescriptor = getOwnPropertyDescriptor;
exports.getPrototypeOf = getPrototypeOf;
exports.hasOwnProperty = hasOwnProperty;
