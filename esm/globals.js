import {secure} from './secure.js';

const {
  FinalizationRegistry,
  Map,
  WeakMap,
  WeakRef
} = secure(globalThis);

export {
  FinalizationRegistry,
  Map,
  WeakMap,
  WeakRef
};
