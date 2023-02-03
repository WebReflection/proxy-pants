'use strict';
const {cached} = require('./any-cache.js');
const {Map} = require('./globals.js');

/**
 * A generic accessor that invokes a callback only when the accessed property
 * is not known.
 * @type {function((field: string | symbol) => unknown):ProxyHandler<object>} a cache for every accessed property.
 */
const cache = cached(Map);
exports.cache = cache;
