import {Proxy} from './proxy.js';
import {Map} from './globals.js';

const has = (map, property) => map.has(property);
const deleteProperty = (map, property) => (map.delete(property), true);

/**
 * A generic accessor that invokes a callback only when the accessed property
 * is not known.
 * @param {(property:string|symbol) => any} get a callback invoked once to set the value.
 * @returns {Proxy<object>} a cache for every accessed property.
 */
export const cache = get => new Proxy(new Map, {
  deleteProperty, has, get(map, property) {
    if (!map.has(property))
      map.set(property, get(property));
    return map.get(property);
  }
});
