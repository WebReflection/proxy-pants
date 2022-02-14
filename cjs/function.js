'use strict';
const {Proxy} = require('./proxy.js');

const {apply: a, bind: b, call: c} = Function;
const apply = c.bind(a);
exports.apply = apply;
const bind = c.bind(b);
exports.bind = bind;
const call = c.bind(c);
exports.call = call;

const applierHandler = {
  get(target, name) {
    return bind(a, target[name]);
  }
};

/** @type {<T>(target:T) => target} A Proxy for a target with secured appliers */
const applier = target => new Proxy(target, applierHandler);
exports.applier = applier;

const callerHandler = {
  get(target, name) {
    return bind(c, target[name]);
  }
};

/** @type {<T>(target:T) => target} A Proxy for a target with secured callers */
const caller = target => new Proxy(target, callerHandler);
exports.caller = caller;

/** @type {<T>(s:T,t:function)=>s} A Proxy for a source to invoke through a target */
const proxy = (source, target) => new Proxy(source, {
  apply: (_, self, args) => apply(target, self, args)
});
exports.proxy = proxy;
