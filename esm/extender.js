import {Proxy} from './proxy.js';
import {bind, call} from './function.js';
import {assign, getOwnPropertyDescriptor, hasOwnProperty} from './object.js';
import {ownKeys} from './reflect.js';
import {Map, WeakMap} from './globals.js';

const id = Symbol('extender');

/**
 * Extend any object through weakly referenced, isolated, self-contained,
 * behaviors.
 * @template {object} P The prototype reference used to augment the target.
 * @param {P} proto The prototype reference used to augment the target.
 * @returns {<T>(target:T) => T & P} A function able to augment/extend once any target.
 */
export const extender = proto => {
  const keys = ownKeys(proto);
  const overrides = new Map;
  const {init} = proto;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key === 'init')
      continue;
    const wm = new WeakMap;
    const descriptor = getOwnPropertyDescriptor(proto, key);
    if (hasOwnProperty(descriptor, 'value')) {
      const {value} = descriptor;
      overrides.set(key, typeof value === 'function' ?
        target => {
          let $ = wm.get(target);
          if (!$) {
            const bound = bind(value, target);
            wm.set(target, $ = {get: () => bound});
          }
          return $;
        } :
        target => {
          let $ = wm.get(target);
          if (!$) {
            let _ = value;
            wm.set(target, $ = {
              get: () => _,
              set: value => { _ = value; }
            });
          }
          return $;
        }
      );
    }
    else {
      const {get, set} = descriptor;
      overrides.set(key, target => {
        let $ = wm.get(target);
        if (!$) {
          wm.set(target, $ = {
            get: () => call(get, target),
            set: value => { call(set, target, value); }
          });
        }
        return $;
      });
    }
  }

  const handler = {
    get: (target, key) => {
      if (key === id) return target;
      let $ = overrides.get(key);
      return $ ? $(target).get() : target[key];
    },
    set: (target, key, value) => {
      let $ = overrides.get(key);
      if ($) $(target).set(value);
      else target[key] = value;
      return true;
    }
  };

  const known = new WeakMap;

  return assign(
    function (target) {
      const wrap = target[id] || target;
      let $ = known.get(wrap);
      if (!$) {
        known.set(wrap, $ = new Proxy(wrap, handler));
        if (init)
          call(init, wrap);
      }
      return $;
    },
    {extends: target => known.has(target[id] || target)}
  );
};
