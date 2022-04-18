'use strict';
// This utility is not secured (yet?)

const toHyphen = name => name.replace(/[A-Z]/g, $ => ('-' + $.toLowerCase()));
const fromHyphen = name => name.replace(/-(.)/g, (_, $) => $.toUpperCase());

const dsmRef = new WeakMap;

class DOMStringMap {
  constructor(prefix) {
    this.prefix = prefix;
  }
  deleteProperty(target, key) {
    key = this.prefix + toHyphen(key);
    target.removeAttribute(key);
    return true;
  }
  get(target, key) {
    key = this.prefix + toHyphen(key);
    for (const {name, value} of target.attributes) {
      if (name === key)
        return value;
    }
  }
  has(target, key) {
    key = this.prefix + toHyphen(key);
    return target.hasAttribute(key);
  }
  ownKeys(target) {
    const {prefix} = this;
    const {length} = prefix;
    const keys = [];
    for (const {name} of target.attributes) {
      if (name.startsWith(this.prefix))
        keys.push(fromHyphen(name.slice(length)));
    }
    return keys;
  }
  set(target, key, value) {
    key = this.prefix + toHyphen(key);
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
