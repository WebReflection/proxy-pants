/**
 * A generic accessor that invokes a callback only when the accessed property
 * is not known.
 * @type {function((field: string | symbol) => unknown):ProxyHandler<object>} a cache for every accessed property.
 */
export const cache: (arg0: (field: string | symbol) => unknown) => ProxyHandler<object>;
