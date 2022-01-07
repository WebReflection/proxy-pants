'use strict';
const {secure} = require('./secure.js');

const {Map, WeakMap} = secure(globalThis);
exports.Map = Map;
exports.WeakMap = WeakMap;
