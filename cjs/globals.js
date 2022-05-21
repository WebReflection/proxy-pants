'use strict';
const {secure} = require('./secure.js');

const {
  FinalizationRegistry,
  Map,
  WeakMap,
  WeakRef
} = secure(globalThis);

exports.FinalizationRegistry = FinalizationRegistry;
exports.Map = Map;
exports.WeakMap = WeakMap;
exports.WeakRef = WeakRef;
