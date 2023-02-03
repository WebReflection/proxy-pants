export function fetch(input: RequestInfo | URL, ...rest: any[]): {
    arrayBuffer?: ArrayBuffer;
    blob?: Blob;
    clone?: Response;
    formData?: FormData;
    json?: object;
    text?: string;
};
