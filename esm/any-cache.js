import {Proxy} from './proxy.js';

const has = (map, property) => map.has(property);
const deleteProperty = (map, property) => (map.delete(property), true);

export const cached = Map => get => new Proxy(new Map, {
  deleteProperty, has, get(map, property) {
    if (!map.has(property))
      map.set(property, get(property));
    return map.get(property);
  }
});
