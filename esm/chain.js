import {Proxy} from './proxy.js';
import {apply, bind, call} from './function.js';
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

/**
 * Trap once all inherited descriptors down the prototypal chain and
 * automatically ensure the right accessor or method is used through
 * a Proxy returned when the resulting callback is invoked with a target.
 * @param {object|function} source 
 * @returns {<T>(target:T) => target}
 */
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
          return bind(value, target);
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
