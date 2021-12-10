# proxy-pants

[![build status](https://github.com/WebReflection/proxy-pants/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/proxy-pants/actions) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/proxy-pants/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/proxy-pants?branch=main) [![CSP strict](https://webreflection.github.io/csp/strict.svg)](https://webreflection.github.io/csp/#-csp-strict)

<sup>**Social Media Photo by [lan deng](https://unsplash.com/@landall) on [Unsplash](https://unsplash.com/)**</sup>  

Secured and reliable Proxy based utilities for more or less common tasks:

  * **[accessor](#accessor)** to trap one or more accessors for any object
  * **[applier & caller](#applier--caller)** to trap any borrowed callback/utility without needing to use `.call` or `.apply` to pass the context
  * **[bound](#bound)** to bind one or more methods all at once
  * **[bread & crumbs](#bread--crumbs)** to track operations through paths (i.e. `a.b.c.d`) and namespaces


### accessor

```js
// import {accessor} from 'proxy-pants/accessor';
import {accessor} from 'proxy-pants';

const {textContent} = accessor(document.body);

// get the current body text
textContent();

// set the new one
textContent('proxy pants!');
```


### applier & caller

```js
// import {applier, caller} from 'proxy-pants/function';
import {applier, caller} from 'proxy-pants';

const {hasOwnProperty, toString} = caller(Object.prototype);

// true
hasOwnProperty({any: 'object'}, 'any');

// [object Null]
toString(null);

const {fromCharCode} = applier(String);

const charCodes = (...args) => fromCharCode(String, args);
// <=>
charCodes(60, 61, 62);
```


### bound

```js
// import {bound} from 'proxy-pants/bound';
import {bound} from 'proxy-pants';

const map = new Map;
const {get, set, has} = bound(map);

// false
has('some');

// the map
set('some', 'value');

// true
has('some');

// 'value'
get('some');
```


### bread & crumbs

```js
// import {bread, crumbs} from 'proxy-pants/breadcrumbs';
import {bread, crumbs} from 'proxy-pants';

const namespace = {
  some: 'value',
  method(...args) {
    return this.some + args.length;
  },
  Class: class {}
};

const facade = crumbs({
  apply(path, args) {
    return bread(namespace, path)(...args);
  },
  construct(path, args) {
    const Class = bread(namespace, path);
    return new Class;
  },
  get(path, key) {
    return bread(namespace, path)[key];
  },
  has(path, key) {
    return key in bread(namespace, path);
  },
  set(path, key, value) {
    bread(namespace, path)[key] = value;
    return true;
  },
  // alias for deleteProperty(path, key) {}
  delete(path, key) {
    return delete bread(namespace, path)[key];
  }
});

facade.some;            // value
facade.method(1, 2, 3); // some3
new facade.Class;       // [object Namespace]
'some' in facade;       // true
facade.test = 'ok';
facade.test;            // ok
delete facade.test;     // true
```
