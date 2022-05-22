'use strict';
const {secure} = require('./secure.js');

const globals = secure(globalThis);
exports.globals = globals;

const {
  Map,
  WeakMap
} = globals;

exports.Map = Map;
exports.WeakMap = WeakMap;
