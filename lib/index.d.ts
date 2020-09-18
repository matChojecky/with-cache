interface CacheOptions<Args extends unknown[], ResultType extends unknown> {
    keymaker?: (...args: Args) => string | number;
    ttl?: number;
    cache?: Cache<ResultType>;
}
interface CacheResolver<Args extends unknown[], ResultType extends unknown> {
    (...args: Args): ResultType;
    clear(): void;
    refresh(...args: Args): ResultType;
}
declare type Cache<T> = Map<string | number, {
    value: T;
    validFor: number;
}>;
export declare function withCache<Args extends unknown[], ResultType extends unknown>(fn: (...args: Args) => ResultType, options?: CacheOptions<Args, ResultType>): CacheResolver<Args, ResultType>;
export {};
//# sourceMappingURL=index.d.ts.map