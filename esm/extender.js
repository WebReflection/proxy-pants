import {Proxy} from './proxy.js';
import {bind, call} from './function.js';
import {includes} from './array.js';
import {getOwnPropertyDescriptor} from './object.js';
import {ownKeys} from './reflect.js';

import {
  Map,
  get as mapGet,
  set as mapSet,
  has as mapHas
} from './map.js';

import {
  WeakMap,
  get as weakGet,
  set as weakSet,
  has as weakHas
} from './weak-map.js';

export const extender = proto => {
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
    get: (target, key) => mapHas(overrides, key) ?
                            mapGet(overrides, key)(target).get() :
                            target[key],
    set: (target, key, value) => {
      if (mapHas(overrides, key))
        mapGet(overrides, key)(target).set(value);
      else
        target[key] = value;
      return true;
    }
  };

  return function (target) {
    return new Proxy(target, handler);
  };
};
