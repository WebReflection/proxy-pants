import {secure} from './secure.js';

export const globals = secure(globalThis);

const {
  Map,
  WeakMap
} = globals;

export {
  Map,
  WeakMap
};
