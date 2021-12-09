const {accessor, applier, bound, bread, crumbs} = require('../cjs');

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
