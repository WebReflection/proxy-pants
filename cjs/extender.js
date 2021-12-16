'use strict';
const {Proxy} = require('./proxy.js');
const {bind, call} = require('./function.js');
const {includes} = require('./array.js');
const {getOwnPropertyDescriptor} = require('./object.js');
const {ownKeys} = require('./reflect.js');
const {secure} = require('./secure.js');

const {Map, WeakMap} = secure(globalThis);

const id = Symbol('extender');

const extender = proto => {
  const overrides = new Map;
  const keys = ownKeys(proto);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const wm = new WeakMap;
    const descriptor = getOwnPropertyDescriptor(proto, key);
    if (includes(ownKeys(descriptor), 'value')) {
      const {value} = descriptor;
      overrides.set(key, typeof value === 'function' ?
        target => {
          if (!wm.has(target)) {
            const $ = bind(value, target);
            wm.set(target, {get: () => $});
          }
          return wm.get(target);
        } :
        target => {
          if (!wm.has(target)) {
            let $ = value;
            wm.set(target, {
              get: () => $,
              set: value => { $ = value; }
            });
          }
          return wm.get(target);
        }
      );
    }
    else {
      const {get, set} = descriptor;
      overrides.set(key, target => {
        if (!wm.has(target)) {
          wm.set(target, {
            get: () => call(get, target),
            set: value => { call(set, target, value); }
          });
        }
        return wm.get(target);
      });
    }
  }

  const handler = {
    get: (target, key) => key === id ? target : (
      overrides.has(key) ?
        overrides.get(key)(target).get() :
        target[key]
    ),
    set: (target, key, value) => {
      if (overrides.has(key))
        overrides.get(key)(target).set(value);
      else
        target[key] = value;
      return true;
    }
  };

  const known = new WeakMap;
  return function (target) {
    const wrap = target[id] || target;
    if (!known.has(wrap))
      known.set(wrap, new Proxy(wrap, handler));
    return known.get(wrap);
  };
};
exports.extender = extender;
