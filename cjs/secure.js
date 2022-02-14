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
    class Secure extends Native {}

    const proto = getOwnPropertyDescriptors(Native.prototype);
    delete proto.constructor;
    freeze(defineProperties(Secure.prototype, proto));

    const statics = getOwnPropertyDescriptors(Native);
    delete statics.length;
    delete statics.prototype;
    statics[species] = {value: Secure};
    return freeze(defineProperties(Secure, statics));
  }
};

/** @type {<T>(target:T) => target} A Proxy for a target to secure */
const secure = target => new Proxy(target, handler);
exports.secure = secure;
