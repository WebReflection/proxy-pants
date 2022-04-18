const {accessor, applier, bound, bread, chain, crumbs, dsm, extender, own, secure} = require('../cjs');
const {proxy: fnProxy} = require('../cjs/function');

const {assert} = bound(console);

const {hasOwnProperty} = applier({});
assert(hasOwnProperty({a: 1}, ['a']));

const map = new Map;
const {get, set, has} = bound(map);
const {size} = accessor(map);

assert(!has('some'));
assert(size() === 0);

assert(set('some', 'value') === map);
assert(get('some') === 'value');
assert(has('some'));
assert(size() === 1);

try {
  size(2);
  assert(false, `this should've thrown`);
}
catch (ok) {}

let root = crumbs();

try {
  root.f();
  assert(false, `this should've thrown`);
}
catch ({message}) {
  assert(message === 'Invalid apply: f');
}

try {
  new root.a.C;
  assert(false, `this should've thrown`);
}
catch ({message}) {
  assert(message === 'Invalid construct: a.C');
}

root.a.b = 2;
assert('a' in root);
assert(root !== root.a && root.a !== root.b);
assert(delete root.a === false);

const namespace = {a: {}};
root = crumbs({
  apply(path, args) {
    return crumbs({
      deleteProperty() {
        return true;
      }
    });
  },
  construct(path, args) {
    return map;
  },
  delete(path, key) {
    return true;
  },
  get(path, key) {
    return crumbs(this, path.concat(key));
  },
  has(path, key) {
    return true;
  },
  set(path, key, value) {
    bread(namespace, path)[key] = value;
    return true;
  }
});

root.a.b = 2;
assert(namespace.a.b === 2);
assert('a' in root);
assert(new root.a.C === map);
assert(root !== root.a && root.a !== root.b);
assert(delete root.a);
assert(delete root.f().last);

// this throws if Reflect.get was used instead
bound(Array)[Symbol.species];


let extValue;
const etxCreator = extender({
  method(...args) {
    extValue = [this, args];
  },
  get accessor() {
    extValue = [this, 'get'];
  },
  set accessor(value) {
    extValue = [this, 'set', value];
  },
  property: 0
});

const wrapped = {any: 'value'};
const ext = etxCreator(wrapped);

assert(ext.valueOf() === ext);
assert(etxCreator(wrapped) === etxCreator(ext));

assert(!hasOwnProperty(ext, ['property']));
assert(ext.property === 0);
ext.property = 1;
assert(ext.property === 1);
assert(etxCreator(wrapped).property === 1);
assert(!hasOwnProperty(ext, ['property']));
assert(etxCreator({}).property === 0);

ext.accessor;
assert(extValue[0] === wrapped);
assert(extValue[1] === 'get');

ext.accessor = 123;
assert(extValue[0] === wrapped);
assert(extValue[1] === 'set');
assert(extValue[2] === 123);

ext.method(1, 2, 3);
assert(extValue[0] === wrapped);
assert(extValue[1].join(',') === '1,2,3');

assert(ext.any === 'value');
ext.any = 'other';
assert(ext.any === 'other');

const created = Object.create({inherited: true}, {prop: {value: true}});
const {inherited, prop} = own(created);
assert(!inherited);
assert(prop);

let initInvoked = false;
let initContext = null;
const OneOff = extender({
  init() {
    initInvoked = !initInvoked;
    initContext = this;
    assert(OneOff(this).test === 'OK', 'extender works on init too');
  },
  get test() { return 'OK'; }
});
OneOff(Object.prototype);
assert(initInvoked);
assert(initContext === Object.prototype, 'context should be preserved on init');


const {Array: $Array} = secure(global);
const arr = $Array.from([1, 2, 3]);
assert($Array.name === 'Array');
assert(arr instanceof $Array);
assert(arr.slice(0) instanceof $Array);
assert(hasOwnProperty($Array.prototype, [Symbol.iterator]));

const ChainedArray = chain(Array);
const ca = ChainedArray([]);
assert(ca.push(1) === ca.length);
ca.length = 0;

const method = function () {
  return this;
};

const proto = {
  _: '',
  get getter() {
    return this._;
  },
  set setter(value) {
    this._ = value;
  },
  method
};
const ChainedObject = chain(proto);

const so = {};
const co = ChainedObject(so);
co.setter = 'OK';
assert(co.getter === 'OK');
assert(co.method() == so);
proto.method = function () { return null; };
assert(co.method() == so);

assert(fnProxy(JSON.parse, function () { return this; }).call(JSON) === JSON);

const target = {
  attributes: new Set,
  hasAttribute(key) {
    for (const {name} of this.attributes) {
      if (name === key)
        return true;
    }
    return false;
  },
  getAttribute(key) {
    for (const {name, value} of this.attributes) {
      if (name === key)
        return value;
    }
  },
  setAttribute(name, value) {
    this.attributes.add({name, value});
  },
  removeAttribute(name) {
    for (const attribute of this.attributes) {
      if (attribute.name === name) {
        this.attributes.delete(attribute);
        break;
      }
    }
  }
};

const {ngset, hasAttribute} = dsm(target);
assert(hasAttribute === target.hasAttribute);
assert(ngset === dsm(target).ngset);
assert(Reflect.ownKeys(ngset).length === 0);
assert(!target.hasAttribute('ng-test-name'));
assert(!('testName' in ngset));
assert(ngset.testName === void 0);
ngset.testName = '123';
assert(ngset.testName === '123');
assert(Reflect.ownKeys(ngset).length === 1);
assert(Reflect.ownKeys(ngset).join('') === 'testName');
assert('testName' in ngset);
assert(target.attributes.size === 1);
assert(target.hasAttribute('ng-test-name'));
assert(target.getAttribute('ng-test-name'));
delete ngset.testName;
assert(!target.hasAttribute('ng-test-name'));
assert(target.getAttribute('ng-test-name') === void 0);

require('./extender.js');
