import {caller} from './function.js';

const $ = Map;
export {$ as Map};

const {get, set, has} = caller($.prototype);
export {get, set, has};
