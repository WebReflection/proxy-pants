import {includes} from './array.js';
import {ownKeys} from './reflect.js';

/** @type {<T>(t:T)=>t} A Proxy for a target that has only own properties */
export const own = target => {
  const keys = ownKeys(target);
  return new Proxy(target, {
    get(target, key) {
      if (includes(keys, key))
        return target[key];
    }
  });
};
