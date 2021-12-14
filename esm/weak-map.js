import {caller} from './function.js';

const $ = WeakMap;
export {$ as WeakMap};

const {get, set, has} = caller($.prototype);
export {get, set, has};
