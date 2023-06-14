const {bound, extender} = require('../cjs');

const {assert} = bound(console);

const a = {a() { return 'a'; }};

const B = extender({
  b() { return 'b'; }
});

const b = B(a);
assert(B(a) === b, 'B(a) should return b');

const C = extender({
  c() { return 'c'; }
});

const c = C(a);
assert(C(a) === c, 'C(a) should return c');

assert(b !== c, 'b and c should be different');

assert(a.a() === 'a', 'a.a() is "a"');
assert(b.a() === 'a', 'b.a() is "a"');
assert(c.a() === 'a', 'c.a() is "a"');

assert(b.b() === 'b', 'b.b() is "b"');
assert(c.c() === 'c', 'c.c() is "c"');

try { b.c(); assert(false, 'b.c() should not be invoked'); }
catch(ok) {}

try { c.b(); assert(false, 'c.b() should not be invoked'); }
catch(ok) {}

assert(B(a) === b, 'B(a) should be b');
assert(B(b) === b, 'B(b) should be b');
assert(B(c) === b, 'B(c) should be b');

assert(C(a) === c, 'C(a) should be c');
assert(C(b) === c, 'C(b) should be c');
assert(C(c) === c, 'C(c) should be c');

assert(C.extends(c), 'C.extends(c)');
assert(C.extends(a), 'C.extends(a)');
assert(!C.extends(b), '!C.extends(b)');
