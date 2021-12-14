'use strict';
const {caller} = require('./function.js');

const $ = Map;
exports.Map = $;

const {get, set, has} = caller($.prototype);
exports.get = get;
exports.set = set;
exports.has = has;
