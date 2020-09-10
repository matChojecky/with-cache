
interface CacheOptions<Args extends unknown[]> {
  keymaker?: (...args: Args) => string | number;
}

interface CacheResolver<Args extends unknown[], ResultType extends unknown> {
  (...args: Args): ResultType;
}

type Cache<T> = Record<string | number, T>;

const defaultKeymaker = <Args extends unknown[]>(...args: Args) =>
  JSON.stringify(args);

export function withCache<Args extends unknown[], ResultType extends unknown>(
  fn: (...args: Args) => ResultType,
  { keymaker = defaultKeymaker }: CacheOptions<Args> = {}
): CacheResolver<Args, ResultType> {
  const cache: Cache<ResultType> = {};

  function cacheResolver(...args: Args) {
    const key = keymaker(...args);
    const cachedValue = cache[key];
    
    if(!!cachedValue) {
      return cachedValue;
    }

    const result = fn(...args);
    cache[key] = result;
    return result;
  }

  return cacheResolver;
}
