import {Proxy} from './proxy.js';
import {bind, get} from './function.js';

const handler = {
  get(target, name) {
    return bind(get(target, name), target);
  }
};
export const bound = target => new Proxy(target, handler);
