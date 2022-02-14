export const concat: {
    (...items: ConcatArray<any>[]): any[];
    (...items: any[]): any[];
};
export const includes: (searchElement: any, fromIndex?: number) => boolean;
export const join: (separator?: string) => string;
export const reduce: {
    (callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any): any;
    (callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any, initialValue: any): any;
    <U>(callbackfn: (previousValue: U, currentValue: any, currentIndex: number, array: any[]) => U, initialValue: U): U;
};
export const unshift: (...items: any[]) => number;
