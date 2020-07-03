"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function withCache(fn, opts) {
    const cache = new Map();
    const { validFor = 14400000, keyGen } = opts !== null && opts !== void 0 ? opts : {};
    const getKey = !!keyGen ? keyGen : () => "res";
    const isValid = (validTo) => Date.now() <= validTo;
    return (...args) => __awaiter(this, void 0, void 0, function* () {
        const key = getKey(...args);
        const cached = cache.get(key);
        if (!!cached && isValid(cached.validTo)) {
            return cached.value;
        }
        const value = yield fn(...args);
        const validTo = Date.now() + validFor;
        cache.set(key, { value, validTo });
        return value;
    });
}
exports.default = withCache;
