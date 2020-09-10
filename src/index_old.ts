export interface WithCacheOptions<T extends (...args: any) => any> {
  validFor?: number;
  keyGen?: (...args: Parameters<T>) => string;
}

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

const withCache = function withCache<F extends (...args: unknown[]) => unknown>(fn: F, opts?: WithCacheOptions<typeof fn>) {
  const cache = new Map();

  const { validFor = 14400000, keyGen } = opts ?? {};
  const getKey = !!keyGen ? keyGen : () => "res";
  const isValid = (validTo: number): boolean => Date.now() <= validTo;

  return async (...args: Parameters<typeof fn>): Promise<UnwrapPromise<ReturnType<typeof fn>>> => {
    const key = getKey(...args)
    const cached = cache.get(key);
    if(!!cached && isValid(cached.validTo)) {
      return cached.value
    }
    const value = await fn(...args);
    const validTo = Date.now() + validFor;
    cache.set(key, {value, validTo})

    return value as UnwrapPromise<ReturnType<typeof fn>>; 
  }
}


export default withCache;