export function extender<P extends unknown>(proto: P): {
    <T>(target: T): T & P;
    extends(target: unknown): boolean;
};
