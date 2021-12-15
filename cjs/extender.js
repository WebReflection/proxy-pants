'use strict';
const {Proxy} = require('./proxy.js');
const {bind, call} = require('./function.js');
const {includes} = require('./array.js');
const {getOwnPropertyDescriptor} = require('./object.js');
const {ownKeys} = require('./reflect.js');

const {
  Map,
  get: mapGet,
  set: mapSet,
  has: mapHas
} = require('./map.js');

const {
  WeakMap,
  get: weakGet,
  set: weakSet,
  has: weakHas
} = require('./weak-map.js');

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
      mapSet(overrides, key, typeof value === 'function' ?
        target => {
          if (!weakHas(wm, target)) {
            const $ = bind(value, target);
            weakSet(wm, target, {get: () => $});
          }
          return weakGet(wm, target);
        } :
        target => {
          if (!weakHas(wm, target)) {
            let $ = value;
            weakSet(wm, target, {
              get: () => $,
              set: value => { $ = value; }
            });
          }
          return weakGet(wm, target);
        }
      );
    }
    else {
      const {get, set} = descriptor;
      mapSet(overrides, key, target => {
        if (!weakHas(wm, target)) {
          weakSet(wm, target, {
            get: () => call(get, target),
            set: value => { call(set, target, value); }
          });
        }
        return weakGet(wm, target);
      });
    }
  }

  const handler = {
    get: (target, key) => key === id ? target : (
      mapHas(overrides, key) ?
        mapGet(overrides, key)(target).get() :
        target[key]
    ),
    set: (target, key, value) => {
      if (mapHas(overrides, key))
        mapGet(overrides, key)(target).set(value);
      else
        target[key] = value;
      return true;
    }
  };

  const known = new WeakMap;
  return function (target) {
    const wrap = target[id] || target;
    if (!weakHas(known, wrap))
      weakSet(known, wrap, new Proxy(wrap, handler));
    return weakGet(known, wrap);
  };
};
exports.extender = extender;
