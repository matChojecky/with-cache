
/**
 * @typedef CacheOptions
 * @typeParam Args Arguments array infered from passed function to cache
 * @typeParam ResultType Value that is returned from operation, infered from  passed function 
 */
interface CacheOptions<Args extends unknown[], ResultType extends unknown> {
  /**
   * Function used to calculate cache key
   * @default ```(...args) => JSON.stringify(args)```
   * @returns returned value used as a cache key
   */
  keymaker?: (...args: Args) => string | number;
  /**
   * Time for how long cached value is valid in ms. Defaults to 1h
   * @default 3600000
   */
  ttl?: number;
  /**
   * Cache instance
   * @default new Map()
   */
  cache?: Cache<ResultType>;
}

/**
 * @typeParam Args Arguments array infered from passed function to cache
 * @typeParam ResultType Value that is returned from operation, infered from  passed function 
 */
interface CacheResolver<Args extends unknown[], ResultType extends unknown> {
  /**
   * Calling cache resolver will call lookup in cache to return matching value or call base function that was passed to {@link withCache} factory
   */
  (...args: Args): ResultType;
  /**
   * Calls clear method on cache instance
   */
  clear(): void;
  /**
   * Using this method won't check for cached values and will call base fn and save result of this operation to cache
   */
  refresh(...args: Args): ResultType;
}

type Cache<T> = Map<string | number, { value: T; validFor: number }>;

/**
 * @hidden
 */
const defaultKeymaker = <Args extends unknown[]>(...args: Args) =>
  JSON.stringify(args);

/**
 * Factory function creating cache resolver for memoized operations
 * @typeParam Args Arguments array infered from passed function to memoize
 * @typeParam ResultType Value that is returned, infered from passed function 
 */
export function withCache<Args extends unknown[], ResultType extends unknown>(
  fn: (...args: Args) => ResultType,
  options: CacheOptions<Args, ResultType> = {}
): CacheResolver<Args, ResultType> {
  const {
    keymaker = defaultKeymaker,
    ttl = 3600000,
    cache = new Map(),
  } = options;

  function runFuncAndSave(
    key: ReturnType<typeof keymaker>,
    ...args: Args
  ): ResultType {
    const result = fn(...args);
    cache.set(key, { value: result, validFor: Date.now() + ttl });
    return result;
  }

  function cacheResolver(...args: Args) {
    const key = keymaker(...args);
    const cachedValue = cache.get(key);

    if (!!cachedValue && cachedValue.validFor > Date.now()) {
      return cachedValue.value;
    }

    return runFuncAndSave(key, ...args);
  }

  cacheResolver.clear = function () {
    cache.clear();
  };

  cacheResolver.refresh = function (...args: Args): ResultType {
    const key = keymaker(...args);
    return runFuncAndSave(key, ...args);
  };

  return cacheResolver;
}
