export const assign: {
    <T, U>(target: T, source: U): T & U;
    <T_1, U_1, V>(target: T_1, source1: U_1, source2: V): T_1 & U_1 & V;
    <T_2, U_2, V_1, W>(target: T_2, source1: U_2, source2: V_1, source3: W): T_2 & U_2 & V_1 & W;
    (target: object, ...sources: any[]): any;
};
export const defineProperties: <T>(o: T, properties: PropertyDescriptorMap & ThisType<any>) => T;
export const freeze: {
    <T>(a: T[]): readonly T[];
    <T_1 extends Function>(f: T_1): T_1;
    <T_2>(o: T_2): Readonly<T_2>;
};
export const getOwnPropertyDescriptor: (o: any, p: PropertyKey) => PropertyDescriptor;
export const getOwnPropertyDescriptors: <T>(o: T) => { [P in keyof T]: TypedPropertyDescriptor<T[P]>; } & {
    [x: string]: PropertyDescriptor;
};
export const getPrototypeOf: (o: any) => any;
export const hasOwnProperty: (v: PropertyKey) => boolean;
