'use strict';
const {Proxy} = require('./proxy.js');

const {fetch: $} = globalThis;

/**
 * Shortcut for `fetch(url).json` or any other *Response* method as direct accessor.
 * Resolves as `undefined` if `response.ok` is `false`.
 * @param {RequestInfo | URL} input the global `fetch` input.
 * @param  {RequestInit} [init] the optional global `fetch` options.
 * @returns {{
 *  arrayBuffer?: ArrayBuffer,
 *  blob?: Blob,
 *  clone?: Response,
 *  formData?: FormData,
 *  json?: object,
 *  text?: string
 * }}
 */
const fetch = (input, ...rest) => new Proxy($(input, ...rest), {
  get: (grab, method) => grab.then(
    response => response.ok ? response[method]() : void 0
  )
});
exports.fetch = fetch;
