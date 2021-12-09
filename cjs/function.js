'use strict';
const {Proxy} = require('./proxy.js');

const {apply: a, bind: b, call: c} = Function;
const apply = c.bind(a);
exports.apply = apply;
const bind = c.bind(b);
exports.bind = bind;
const call = c.bind(c);
exports.call = call;

const {get: g} = Reflect;
const get = bind(c, g, Reflect);
exports.get = get;

const applierHandler = {
  get(target, name) {
    return bind(a, get(target, name));
  }
};
const applier = target => new Proxy(target, applierHandler);
exports.applier = applier;

const callerHandler = {
  get(target, name) {
    return bind(c, get(target, name));
  }
};
const caller = target => new Proxy(target, callerHandler);
exports.caller = caller;
