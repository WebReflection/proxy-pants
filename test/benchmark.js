const {bound, caller} = require('../cjs');

const {ownKeys} = bound(Reflect);

const allBoundsFor = Class => {
  const $Class = bound(Class);
  const $class = [];
  for (const key of ownKeys(Class)) {
    if (typeof key !== 'symbol' && typeof Class[key] === 'function')
      $class.push($Class[key]);
  }
  return $class;
};

const allCallersOf = ({prototype}) => {
  const $methods = [];
  for (const key of ownKeys(prototype)) {
    if (typeof prototype[key] === 'function')
      $methods.push(caller(prototype[key]));
  }
  return $methods;
};

const benchmark = (info, run = 1) => {
  console.log(`\x1b[1m\x1b[2mrun ${run}\x1b[0m`);
  console.time('bound');
  let allBounds = [];
  for (let i = 0; i < 5; i++) {
    allBounds = [
      ...allBoundsFor(Object),
      ...allBoundsFor(Array),
      ...allBoundsFor(Reflect),
      ...allBoundsFor(String),
    ];
  }
  console.timeEnd('bound');
  console.log('bound', allBounds.length);

  console.time('caller');
  let allCallers = [];
  for (let i = 0; i < 5; i++) {
    allCallers = [
      ...allCallersOf(Object),
      ...allCallersOf(Array),
      ...allCallersOf(String),
    ];
  }
  console.timeEnd('caller');
  console.log('caller', allCallers.length);
  console.log('');
  if (--info.times)
    setTimeout(benchmark, 250, info, ++run);
};

benchmark({times: 3});
