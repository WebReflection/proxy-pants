'use strict';
const {Proxy} = require('./proxy.js');
const {bind} = require('./function.js');

const handler = {
  get(target, name) {
    return bind(target[name], target);
  }
};

/** @type {<T>(target:T) => target} A Proxy for a target with automatic bound methods. */
const bound = target => new Proxy(target, handler);
exports.bound = bound;
