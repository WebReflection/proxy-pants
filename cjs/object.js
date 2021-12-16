'use strict';
const {bound} = require('./bound.js');
const {caller} = require('./function.js');

const {
  defineProperties,
  freeze,
  getOwnPropertyDescriptor,
  getOwnPropertyDescriptors,
  getPrototypeOf
} = bound(Object);

const {hasOwnProperty} = caller({});

exports.defineProperties = defineProperties;
exports.freeze = freeze;
exports.getOwnPropertyDescriptor = getOwnPropertyDescriptor;
exports.getOwnPropertyDescriptors = getOwnPropertyDescriptors;
exports.getPrototypeOf = getPrototypeOf;
exports.hasOwnProperty = hasOwnProperty;
