'use strict';
const {bound} = require('./bound.js');
const {caller} = require('./function.js');

const {
  assign,
  defineProperties,
  freeze,
  getOwnPropertyDescriptor,
  getOwnPropertyDescriptors,
  getPrototypeOf
} = bound(Object);

const {hasOwnProperty} = caller({});

exports.assign = assign;
exports.defineProperties = defineProperties;
exports.freeze = freeze;
exports.getOwnPropertyDescriptor = getOwnPropertyDescriptor;
exports.getOwnPropertyDescriptors = getOwnPropertyDescriptors;
exports.getPrototypeOf = getPrototypeOf;
exports.hasOwnProperty = hasOwnProperty;
