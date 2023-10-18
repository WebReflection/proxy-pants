import {Proxy} from './proxy.js';

const registry = new FinalizationRegistry(
  ([target, handler]) => { handler.collected?.(target) }
);

/** @type {Proxy} */
export default class WeakProxy {
  constructor(target, handler) {
    const proxy = new Proxy(target, handler);
    registry.register(proxy, [target, handler]);
    return proxy;
  }
}
