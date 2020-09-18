/**
 * @typedef CacheOptions
 * @typeParam Args Arguments array that base function accepts
 * @typeParam CacheItem Type of returned value from base function 
 */
interface CacheOptions<Args extends unknown[], CacheItem extends unknown> {
  /**
   * Function used to calculate cache key
   * @default (...args) => JSON.stringify(args)
   * @returns returned value used as a cache key
   */
  keymaker?: (...args: Args) => string | number;
  /**
   * Time to live of cached value in ms
   * @default 3600000
   */
  ttl?: number;
  /**
   * Cache instance
   * @default new Map()
   */
  cache?: Cache<CacheItem>;
}

/**
 * @typeParam Args Arguments array that base function accepts
 * @typeParam ResultType Type of returned value from base function 
 */
interface CacheResolver<Args extends unknown[], ResultType extends unknown> {
  (...args: Args): ResultType;
  /**
   * clear cache
   */
  clear(): void;
  /**
   * Using this method won't check for cached values and will straight call memoized fn and save new result to cache
   */
  refresh(...args: Args): ResultType;
}

type Cache<T> = Map<string | number, { value: T; validFor: number }>;

/**
 * @ignore
 */
const defaultKeymaker = <Args extends unknown[]>(...args: Args) =>
  JSON.stringify(args);

/**
 * Creates function that caches results returned from base function fn
 * @typeParam Args Arguments array that base function accepts
 * @typeParam ResultType Type of returned value from base function 
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
