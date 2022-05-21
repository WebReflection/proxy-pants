/**
 * A generic accessor that invokes a callback only when the accessed property
 * is not known.
 * @param {(property:string|symbol) => any} get a callback invoked once to set the value.
 * @returns {Proxy<object>} a cache for every accessed property.
 */
export const wcache: (get: any) => any;
