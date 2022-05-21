'use strict';
const {cached} = require('./any-cache.js');
const {Map} = require('./globals.js');

/**
 * A generic accessor that invokes a callback only when the accessed property
 * is not known.
 * @param {(property:string|symbol) => any} get a callback invoked once to set the value.
 * @returns {Proxy<object>} a cache for every accessed property.
 */
const cache = cached(Map);
exports.cache = cache;
