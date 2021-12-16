'use strict';
const {Proxy} = require('./proxy.js');
const {
  defineProperties,
  freeze,
  getOwnPropertyDescriptors
} = require('./object.js');

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

const secure = target => new Proxy(target, handler);
exports.secure = secure;
