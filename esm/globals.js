import {secure} from './secure.js';

const {Map, WeakMap} = secure(globalThis);
export {Map, WeakMap};
