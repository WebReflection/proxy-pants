import {bound} from './bound.js';
import {caller} from './function.js';

const {
  freeze,
  getOwnPropertyDescriptor,
  getPrototypeOf
} = bound(Object);

const {hasOwnProperty} = caller({});

export {
  freeze,
  getOwnPropertyDescriptor,
  getPrototypeOf,
  hasOwnProperty
};
