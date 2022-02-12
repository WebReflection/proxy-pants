import {Proxy} from './proxy.js';
import {bind} from './function.js';

const handler = {
  get(target, name) {
    return bind(target[name], target);
  }
};

/** @type {<T>(t:T)=>t} A Proxy for a target with automatic bound methods. */
export const bound = target => new Proxy(target, handler);
