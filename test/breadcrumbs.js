const {bread, crumbs} = require('../cjs');

const client = crumbs({
  apply(path, args) {
    return server(path.concat('apply', JSON.stringify(args)));
  },
  construct(path, args) {
    return server(path.concat('new', JSON.stringify(args)));
  }
});

const namespace = {
  some: {
    part: {
      of: {
        it: {
          method() {
            return 'method';
          },
          Class: class Test {}
        }
      }
    }
  }
};

const server = (path) => {
  for (let i = 0; i < path.length; i++) {
    switch (path[i]) {
      case 'apply':
        debugger;
        const context = bread(namespace, path.slice(0, i - 1));
        return context[path[i - 1]](...JSON.parse(path[i + 1]));
      case 'new':
        debugger;
        const Class = bread(namespace, path.slice(0, i));
        return new Class(...JSON.parse(path[i + 1]));
    }
  }
};

const tmp = client.some.part.of.it;
const invoke = tmp.method();
const instance = new tmp.Class(4, 5, 6);
console.log(invoke);
console.log(instance);
