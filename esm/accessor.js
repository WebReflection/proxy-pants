import {Proxy} from './proxy.js';
import {apply, call} from './function.js';
import {
  getOwnPropertyDescriptor,
  getPrototypeOf,
  hasOwnProperty
} from './object.js';

const handler = {
  get(target, name) {
    const context = target;
    while (!hasOwnProperty(target, name))
      target = getPrototypeOf(target);
    const {get, set} = getOwnPropertyDescriptor(target, name);
    return function () {
      return arguments.length ?
              apply(set, context, arguments) :
              call(get, context);
    };
  }
};

export const accessor = target => new Proxy(target, handler);
