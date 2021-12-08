'use strict';
const {Proxy} = require('./proxy.js');
const {bind} = require('./function.js');

const handler = {
  get: (target, name) => bind(target[name], target)
};

const bound = target => new Proxy(target, handler);
exports.bound = bound;
