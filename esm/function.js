import {Proxy} from './proxy.js';

const {apply: a, bind: b, call: c} = Function;
export const apply = c.bind(a);
export const bind = c.bind(b);
export const call = c.bind(c);

const applierHandler = {
  get(target, name) {
    return bind(a, target[name]);
  }
};
export const applier = target => new Proxy(target, applierHandler);

const callerHandler = {
  get(target, name) {
    return bind(c, target[name]);
  }
};
export const caller = target => new Proxy(target, callerHandler);

export const proxy = (source, target) => new Proxy(source, {
  apply: (_, self, args) => apply(target, self, args)
});
