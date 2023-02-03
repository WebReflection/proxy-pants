import {Proxy} from './proxy.js';

const {fetch: $} = globalThis;

/**
 * Shortcut for `fetch(url).json` or any other *Response* method as direct accessor.
 * Resolves as `undefined` if `response.ok` is `false`.
 * @param {RequestInfo | URL} input the global `fetch` input.
 * @param  {RequestInit} [init] the optional global `fetch` options.
 * @returns {{
 *  arrayBuffer?: Promise<ArrayBuffer>,
 *  blob?: Promise<Blob>,
 *  clone?: Promise<Response>,
 *  formData?: Promise<FormData>,
 *  json?: Promise<object>,
 *  text?: Promise<string>
 * }}
 */
export const fetch = (input, ...rest) => new Proxy($(input, ...rest), {
  get: (grab, method) => grab.then(
    response => response.ok ? response[method]() : void 0
  )
});
