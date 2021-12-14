'use strict';
const {caller} = require('./function.js');

const {concat, includes, join, reduce} = caller([]);
exports.concat = concat;
exports.includes = includes;
exports.join = join;
exports.reduce = reduce;
