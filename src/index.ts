const defaultKeymaker = (...args: unknown[]) => JSON.stringify(args);

export function withCache(
  fn: any,
  keymaker = defaultKeymaker
) {
  const cache = {};

  function cacheResolver() {}

  return cacheResolver;
}
