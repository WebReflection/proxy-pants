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
