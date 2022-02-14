export const apply: any;
export const bind: any;
export const call: any;
/** @type {<T>(target:T) => target} A Proxy for a target with secured appliers */
export const applier: <T>(target: T) => T;
/** @type {<T>(target:T) => target} A Proxy for a target with secured callers */
export const caller: <T>(target: T) => T;
/** @type {<T>(s:T,t:function)=>s} A Proxy for a source to invoke through a target */
export const proxy: <T>(s: T, t: Function) => T;
