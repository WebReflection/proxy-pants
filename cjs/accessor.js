'use strict';
const {Proxy} = require('./proxy.js');
const {apply, call} = require('./function.js');
const {
  getOwnPropertyDescriptor,
  getPrototypeOf,
  hasOwnProperty
} = require('./object.js');

const handler = {
  get(target, name) {
    const context = target;
    while (!hasOwnProperty(target, name))
      target = getPrototypeOf(target);
    const {get, set} = getOwnPropertyDescriptor(target, name);
    return function () {
      return arguments.length ?
              apply(set, context, arguments) :
              call(get, context);
    };
  }
};

/** @type {<T>(target:T) => target} A Proxy for a target with automatic bound accessors. */
const accessor = target => new Proxy(target, handler);
exports.accessor = accessor;
