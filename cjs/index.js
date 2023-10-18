'use strict';
(m => {
  exports.accessor = m.accessor;
})(require('./accessor.js'));
(m => {
  exports.applier = m.applier;
  exports.caller = m.caller;
})(require('./function.js'));
(m => {
  exports.bound = m.bound;
})(require('./bound.js'));
(m => {
  exports.bread = m.bread;
  exports.crumbs = m.crumbs;
})(require('./breadcrumbs.js'));
(m => {
  exports.cache = m.cache;
})(require('./cache.js'));
(m => {
  exports.wcache = m.wcache;
})(require('./weak-cache.js'));
(m => {
  exports.chain = m.chain;
})(require('./chain.js'));
(m => {
  exports.extender = m.extender;
})(require('./extender.js'));
(m => {
  exports.fetch = m.fetch;
})(require('./fetch.js'));
(m => {
  exports.dsm = m.dsm;
})(require('./dsm.js'));
(m => {
  exports.own = m.own;
})(require('./own.js'));
(m => {
  exports.secure = m.secure;
})(require('./secure.js'));
(m => {
  exports.watcher = m.watcher;
})(require('./watcher.js'));

const WeakProxy = require('./weak-proxy.js');
exports.WeakProxy = WeakProxy;
