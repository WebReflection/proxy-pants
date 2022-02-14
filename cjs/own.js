'use strict';
const {includes} = require('./array.js');
const {ownKeys} = require('./reflect.js');

/** @type {<T>(target:T) => target} A Proxy for a target that reveals only own properties */
const own = target => {
  const keys = ownKeys(target);
  return new Proxy(target, {
    get(target, key) {
      if (includes(keys, key))
        return target[key];
    }
  });
};
exports.own = own;
