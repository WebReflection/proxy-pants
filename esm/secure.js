import {Proxy} from './proxy.js';
import {
  defineProperties,
  freeze,
  getOwnPropertyDescriptors,
} from './object.js';

const {species} = Symbol;

const handler = {
  get(target, name) {
    const Native = target[name];
    class Secure extends Native {
      static get [species]() {
        return Secure;
      }
    }
    const proto = getOwnPropertyDescriptors(Native.prototype);
    delete proto.constructor;
    freeze(defineProperties(Secure.prototype, proto));
    const statics = getOwnPropertyDescriptors(Native);
    delete statics.length;
    delete statics.prototype;
    delete statics[species];
    return freeze(defineProperties(Secure, statics));
  }
};

export const secure = target => new Proxy(target, handler);
