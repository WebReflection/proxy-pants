import {bound} from './bound.js';
import {caller} from './function.js';

const {
  assign,
  defineProperties,
  freeze,
  getOwnPropertyDescriptor,
  getOwnPropertyDescriptors,
  getPrototypeOf
} = bound(Object);

const {hasOwnProperty} = caller({});

export {
  assign,
  defineProperties,
  freeze,
  getOwnPropertyDescriptor,
  getOwnPropertyDescriptors,
  getPrototypeOf,
  hasOwnProperty
};
