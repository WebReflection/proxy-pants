'use strict';
const {Proxy} = require('./proxy.js');

const registry = new FinalizationRegistry(
  ([target, handler]) => { handler.collected?.(target) }
);

/** @type {Proxy} */
module.exports = class WeakProxy {
  constructor(target, handler) {
    const proxy = new Proxy(target, handler);
    registry.register(proxy, [target, handler]);
    return proxy;
  }
}
