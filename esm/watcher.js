class Handler {
  constructor() { this._m = this._wm = null }
  get m() { return this._m || (this._m = new Map) }
  get wm() { return this._wm || (this._wm = new WeakMap) }
  get(target, prop) {
    if (prop === 'watch')
      return (prop, handler) => { this.m.set(prop, handler) };
    if (prop === 'unwatch')
      return prop => { this.m.delete(prop) };
    const value = target[prop];
    if (typeof value === 'object' && value) {
      let proxy = this.wm.get(value);
      if (!proxy)
        this.wm.set(value, proxy = watcher(value));
      return proxy;
    }
    return value;
  }
  set(target, prop, value, proxy) {
    const prev = target[prop];
    target[prop] = value;
    if (prev !== value && this._m) {
      const handler = this.m.get(prop);
      if (handler)
        handler.call(proxy, prop, prev, value);
    }
    return true;
  }
}

export const watcher = target => new Proxy(target, new Handler);
