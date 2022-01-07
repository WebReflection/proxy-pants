import {apply, call} from './function.js';
import {assign, getOwnPropertyDescriptors, getPrototypeOf} from './object.js';
import {unshift} from './array.js';
import {Map} from './globals.js';

const map = new Map;
const descriptors = target => {
  const chain = [];
  let current = target;
  while (current) {
    if (map.has(current))
      unshift(chain, map.get(current));
    else {
      const descriptors = getOwnPropertyDescriptors(current);
      map.set(current, descriptors);
      unshift(chain, descriptors);
    }
    current = getPrototypeOf(current);
  }
  unshift(chain, {});
  return apply(assign, null, chain);
};

export const chain = source => {
  const target = typeof source === 'function' ? source.prototype : source;
  const chained = descriptors(target);
  const handler = {
    get(target, key) {
      if (key in chained) {
        const {value, get} = chained[key];
        if (get)
          return call(get, target);
        if (typeof value === 'function')
          return value;
      }
      return target[key];
    },
    set(target, key, value) {
      if (key in chained) {
        const {set} = chained[key];
        if (set) {
          call(set, target, value);
          return true;
        }
      }
      target[key] = value;
      return true;
    }
  };
  return target => new Proxy(target, handler);
};
