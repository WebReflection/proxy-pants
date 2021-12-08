import {Proxy} from './proxy.js';
import {bind} from './function.js';
import {concat, join, reduce} from './array.js';
import {freeze} from './object.js';

const APPLY = 'apply';
const CONSTRUCT = 'construct';
const DELETE_PROPERTY = 'deleteProperty';
const GET = 'get';
const HAS = 'has';
const SET = 'set';

const crawl = (object, key) => object[key];

const create = ($, _) => new Proxy(
  bind(Crumbs, {$, _: freeze(_)}),
  handler
);

const error = ($, _) => {
  throw new Error(`Invalid ${$}: ${join(_, '.')}`);
};

const handler = {
  [APPLY](target, n, args) {
    const {$, _} = target();
    if (APPLY in $)
      return $[APPLY](_, args);
    error(APPLY, _);
  },
  [CONSTRUCT](target, args) {
    const {$, _} = target();
    if (CONSTRUCT in $)
      return $[CONSTRUCT](_, args);
    error(CONSTRUCT, _);
  },
  [DELETE_PROPERTY](target, key) {
    const {$, _} = target();
    let method = 'delete';
    if (!(method in $))
      method = DELETE_PROPERTY;
    if (!(method in $))
      method = '';
    return !!method && $[method](_, key);
  },
  [GET](target, key) {
    const {$, _} = target();
    return GET in $ ? $[GET](_, key) : create($, concat(_, key));
  },
  [HAS](target, key) {
    const {$, _} = target();
    return !(HAS in $) || $[HAS](_, key);
  },
  [SET](target, key, value) {
    const {$, _} = target();
    return SET in $ && $[SET](_, key, value);
  }
};

export const bread = (namespace, crumbs) => reduce(crumbs, crawl, namespace);
export const crumbs = (listeners = {}, list = []) => create(listeners, list);

function Crumbs() {
  return this;
}
