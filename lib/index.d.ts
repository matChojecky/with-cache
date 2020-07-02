export interface WithCacheOptions<T extends (...args: any) => any> {
    validFor?: number;
    keyGen?: (...args: Parameters<T>) => string;
}
export declare type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export default function withCache<F extends (...args: unknown[]) => unknown>(fn: F, opts?: WithCacheOptions<typeof fn>): (...args: Parameters<typeof fn>) => Promise<UnwrapPromise<ReturnType<typeof fn>>>;
//# sourceMappingURL=index.d.ts.map