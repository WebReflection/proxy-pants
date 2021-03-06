import {Proxy} from './proxy.js';
import {includes} from './array.js';
import {ownKeys} from './reflect.js';

/** @type {<T>(target:T) => target} A Proxy for a target that reveals only own properties */
export const own = target => {
  const keys = ownKeys(target);
  return new Proxy(target, {
    get(target, key) {
      if (includes(keys, key))
        return target[key];
    }
  });
};
