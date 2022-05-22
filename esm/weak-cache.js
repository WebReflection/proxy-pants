import {cached} from './any-cache.js';
import {Map, globals} from './globals.js';

const {FinalizationRegistry, WeakRef} = globals;

/**
 * A generic accessor that invokes a callback only when the accessed property
 * is not known.
 * @param {(property:string|symbol) => any} get a callback invoked once to set the value.
 * @returns {Proxy<object>} a cache for every accessed property.
 */
export const wcache = cached(class WeakValue extends Map {
  // https://github.com/WebReflection/weak-value
  #delete = key => {
    this.#registry.unregister(super.get(key));
    super.delete(key);
  };
  #registry = new FinalizationRegistry(key => {
    /* c8 ignore next */
    super.delete(key);
  });
  delete(key) {
    return super.has(key) && !this.#delete(key);
  }
  has(key) {
    let has = super.has(key);
    if (has && !super.get(key).deref())
      /* c8 ignore next */
      has = !!this.#delete(key);
    return has;
  }
  get(key) {
    const ref = super.get(key);
    return ref && ref.deref();
  }
  set(key, value) {
    this.delete(key);
    const ref = new WeakRef(value);
    this.#registry.register(value, key, ref);
    return super.set(key, ref);
  }
});
