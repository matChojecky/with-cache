export declare type WithCacheOptions<T extends (...args: any) => any> = {
    validFor?: number;
    keyGen?: (...args: Parameters<T>) => string;
};
export declare type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
declare const withCache: <F extends (...args: unknown[]) => unknown>(fn: F, opts?: WithCacheOptions<F> | undefined) => (...args: Parameters<F>) => Promise<UnwrapPromise<ReturnType<F>>>;
export default withCache;
//# sourceMappingURL=index.d.ts.map