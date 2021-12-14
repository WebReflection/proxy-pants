import {includes} from './array.js';
import {ownKeys} from './reflect.js';

export const own = target => {
  const keys = ownKeys(target);
  return new Proxy(target, {
    get(target, key) {
      if (includes(keys, key))
        return target[key];
    }
  });
};
