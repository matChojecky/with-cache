declare type WithCacheOptions<T extends (...args: any) => any> = {
    validFor?: number;
    keyGen?: (...args: Parameters<T>) => string;
};
declare type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
declare function withCache<F extends (...args: unknown[]) => unknown>(fn: F, opts?: WithCacheOptions<typeof fn>): (...args: Parameters<typeof fn>) => Promise<UnwrapPromise<ReturnType<typeof fn>>>;
export default withCache;
//# sourceMappingURL=index.d.ts.map