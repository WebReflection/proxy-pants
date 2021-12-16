import {bound} from './bound.js';
import {caller} from './function.js';

const {
  defineProperties,
  freeze,
  getOwnPropertyDescriptor,
  getOwnPropertyDescriptors,
  getPrototypeOf
} = bound(Object);

const {hasOwnProperty} = caller({});

export {
  defineProperties,
  freeze,
  getOwnPropertyDescriptor,
  getOwnPropertyDescriptors,
  getPrototypeOf,
  hasOwnProperty
};
