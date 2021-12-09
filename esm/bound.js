import {Proxy} from './proxy.js';
import {bind} from './function.js';

const handler = {
  get(target, name) {
    return bind(target[name], target);
  }
};
export const bound = target => new Proxy(target, handler);
