# proxy-pants

[![build status](https://github.com/WebReflection/proxy-pants/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/proxy-pants/actions) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/proxy-pants/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/proxy-pants?branch=main) [![CSP strict](https://webreflection.github.io/csp/strict.svg)](https://webreflection.github.io/csp/#-csp-strict)

<sup>**Social Media Photo by [lan deng](https://unsplash.com/@landall) on [Unsplash](https://unsplash.com/)**</sup>

Secured and reliable Proxy based utilities for more or less common tasks:

  * **[accessor](#accessor)** to trap one or more accessors for any object
  * **[applier & caller](#applier--caller)** to trap any borrowed callback/utility without needing to use `.call` or `.apply` to pass the context
  * **[bound](#bound)** to bind one or more methods all at once
  * **[bread & crumbs](#bread--crumbs)** to track operations through paths (i.e. `a.b.c.d`) and namespaces
  * **[cache](#cache)** to compute once any accessed property through a proxied, and secured, map
  * **[chain](#chain)** to trap once all inherited descriptors down the prototypal chain and automatically ensure the right accessor or method
  * **[dsm](#dsm)** to virtually trap `dataset` / `*set` accessors as *DOMStringMap* like references per each element. Please note this utility is not secured
  * **[extender](#extender)** to extend any object through weakly referenced behaviors, providing a new way to deal with state machines too, through the following features:
    * **methods** are always the same bound reference
    * **properties** are defined per extender and never directly attached to the source
    * **accessors** are also defined per each extender
    * multiple extenders calls to the same source preserve previous state, and any source can pass through multiple extenders without ever conflicting
  * **[own](#own)** to destructure only own properties
  * **[secure](#secure)** to ensure local classes cannot be patched at runtime down their prototypal chain
  * **[weak-cache](#weak-cache)** same as [cache](#cache) but the returned reference is weakly retained



### accessor

Trap one or more accessors for any object.

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

Trap any borrowed callback/utility without needing to use `.call` or `.apply` to pass the context.

```js
// import {applier, caller} from 'proxy-pants/function';
import {applier, caller} from 'proxy-pants';

const {hasOwnProperty, toString} = caller(Object.prototype);

// true
hasOwnProperty({any: 'object'}, 'any');

// [object Null]
toString(null);

const {fromCharCode} = applier(String);

const charCodes = (...args) => fromCharCode(null, args);
// <=>
charCodes(60, 61, 62);
```



### bound

Bind one or more methods all at once.

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

Track operations through paths (i.e. `a.b.c.d`) and namespaces.

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



### cache

A secured `Map` wrapper to retrieve any *property* once, through the given callback.

```js
// import {cache} from 'proxy-pants/cache';
import {cache} from 'proxy-pants';

const uids = cache((name) => (name + Math.random()));

uids.a;             // "a0.23456787654"
uids.b;             // "b0.87654334567"
uids.a === uids.a;  // true
'a' in uids;        // true
delete uids.a;      // true
'a' in uids;        // false
```



### chain

Trap once all inherited descriptors down the prototypal chain and automatically ensure the right accessor or method.

```js
// import {chain} from 'proxy-pants/chain';
import {chain} from 'proxy-pants';

const asNode = chain(Node);
const asElement = chain(Element);

asNode(document.createTextNode('accessor')).data;
asElement(document.body).querySelector('method');
```



### dsm

Virtually trap `dataset` / `*set` accessors as *DOMStringMap* like references per each element.

```js
// import {dsm} from 'proxy-pants/dsm';
import {dsm} from 'proxy-pants';

const {ngset: ng, vset: v} = dsm(element);

// set ng-value attribute
ng.value = 123;

// remove ng-some-thing attribute
delete ng.someThing;

// logs v-if attribute, if any
console.log(v.if);
```



### extender

Extend any object through weakly referenced behaviors, providing a new way to deal with state machines too, through the following features:

  * **methods** are always the same bound reference
  * **properties** are defined per extender and never directly attached to the source
  * **accessors** are also defined per each extender
  * multiple extenders calls to the same source preserve previous state, and any source can pass through multiple extenders without ever conflicting

```js
// import {extender} from 'proxy-pants/extender';
import {extender} from 'proxy-pants';

const Magic = extender({
  // properties are per extender and weakly related
  isMagic: true,

  // accessors context is the original source/target
  get magic() {
    // this === source
    return Magic(this).isMagic;
  },

  // methods are always same bound method reference (except init)
  hasMagic() {
    // this === source
    return $(this).magic;
  },

  // a special method that helps setting up any reference once
  // bear in mind Magic(ref).init() won't be defined as own method
  init() {
    // this is implicitly invoked only the first time Magic(this) is used
  }
});

// it can be simplified per module as ...
const $ = Magic;

const source = {};
const target = Magic(source);

target.isMagic;     // true
target.magic;       // true
target.hasMagic();  // true
```



### own

Destructure only own properties.

```js
// import {own} from 'proxy-pants/own';
import {own} from 'proxy-pants';

const created = Object.create(
  {inherited: true},
  {prop: {value: true}}
);

const {inherited, prop} = own(created);

console.assert(!inherited);
console.assert(prop);
```



### secure

Ensure local classes cannot be patched at runtime down their prototypal chain.

```js
// import {secure} from 'proxy-pants/secure';
import {secure} from 'proxy-pants';

const {
  Map,
  WekMap
} = secure(globalThis);

// both instances now can be used without
// possible issues down the prototypal chain
const map = new Map;
const wm = new WeakMap;
```



### weak-cache

A secured [WeakValue](https://github.com/WebReflection/weak-value#readme) wrapper to retrieve any *property* once, through the given callback, and reteain the result weakly.

```js
// import {wcache} from 'proxy-pants/wcache';
import {wcache} from 'proxy-pants';

// the value has to be an object/reference
const uids = wcache((name) => new String((name + Math.random())));

uids.a;             // new String("a0.23456787654")
uids.b;             // new String("b0.87654334567")
uids.a === uids.a;  // true
'a' in uids;        // true
delete uids.a;      // true
'a' in uids;        // false
```
