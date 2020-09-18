"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCache = void 0;
const defaultKeymaker = (...args) => JSON.stringify(args);
function withCache(fn, options = {}) {
    const { keymaker = defaultKeymaker, ttl = 3600000, cache = new Map(), } = options;
    function runFuncAndSave(key, ...args) {
        const result = fn(...args);
        cache.set(key, { value: result, validTo: Date.now() + ttl });
        return result;
    }
    function cacheResolver(...args) {
        const key = keymaker(...args);
        const cachedValue = cache.get(key);
        if (!!cachedValue && cachedValue.validTo > Date.now()) {
            return cachedValue.value;
        }
        return runFuncAndSave(key, ...args);
    }
    cacheResolver.clear = function () {
        cache.clear();
    };
    cacheResolver.refresh = function (...args) {
        const key = keymaker(...args);
        return runFuncAndSave(key, ...args);
    };
    return cacheResolver;
}
exports.withCache = withCache;
