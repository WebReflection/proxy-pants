import {Proxy} from './proxy.js';

const {apply: a, bind: b, call: c} = Function;
export const apply = c.bind(a);
export const bind = c.bind(b);
export const call = c.bind(c);

const {get: g} = Reflect;
export const get = bind(c, g, Reflect);

const applierHandler = {
  get(target, name) {
    return bind(a, get(target, name));
  }
};
export const applier = target => new Proxy(target, applierHandler);

const callerHandler = {
  get(target, name) {
    return bind(c, get(target, name));
  }
};
export const caller = target => new Proxy(target, callerHandler);
