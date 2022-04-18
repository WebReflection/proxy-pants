'use strict';
// This utility is not insecured (yet?)
const hyphenizer = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('hyphenizer'));

const dsmRef = new WeakMap;

class DOMStringMap {
  constructor(prefix) {
    this.prefix = prefix;
  }
  deleteProperty(target, key) {
    key = this.prefix + hyphenizer(key);
    target.removeAttribute(key);
    return true;
  }
  get(target, key) {
    key = this.prefix + hyphenizer(key);
    for (const {name, value} of target.attributes) {
      if (name === key)
        return value;
    }
  }
  has(target, key) {
    key = this.prefix + hyphenizer(key);
    return target.hasAttribute(key);
  }
  set(target, key, value) {
    key = this.prefix + hyphenizer(key);
    target.setAttribute(key, value);
  }
}

const handler = {
  get(target, name) {
    if (/set$/.test(name)) {
      if (!dsmRef.has(target))
        dsmRef.set(target, new Map);

      const nmsp = dsmRef.get(target);
      if (!nmsp.has(name))
        nmsp.set(name, new Proxy(target, new DOMStringMap(name.slice(0, -3) + '-')));
      return nmsp.get(name);
    }
    return target[name];
  }
};

/** @type {<T>(target:T) => target} A Proxy for an element to handle dataset like attributes. */
const dsm = target => new Proxy(target, handler);
exports.dsm = dsm;
