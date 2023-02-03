export function fetch(input: RequestInfo | URL, ...rest: any[]): {
    arrayBuffer?: Promise<ArrayBuffer>;
    blob?: Promise<Blob>;
    clone?: Promise<Response>;
    formData?: Promise<FormData>;
    json?: Promise<object>;
    text?: Promise<string>;
};
