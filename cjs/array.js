'use strict';
const {caller} = require('./function.js');

const {concat, join, reduce} = caller([]);

exports.concat = concat;
exports.join = join;
exports.reduce = reduce;
