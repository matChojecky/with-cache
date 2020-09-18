import assert from "assert";
import { withCache } from "../src/index";
import { sleep } from "./helpers";

describe("withCache", () => {
  it("should return function", () => {
    const fn = () => {
      return Date.now();
    };
    const cached = withCache(fn);

    assert.strictEqual(typeof cached, "function");
  });

  it("should call function only once and then return cached value", () => {
    const fn = () => {
      fn.called += 1;
      return Date.now();
    };

    fn.called = 0;

    const resolver = withCache(fn);
    const r1 = resolver();
    resolver();
    const r2 = resolver();

    assert.strictEqual(fn.called, 1);
    assert.strictEqual(r1, r2);
  });

  it("should accept args and return different cached values based on passed args", () => {
    const fn = (_: any) => {
      fn.called += 1;
      return Date.now();
    };

    fn.called = 0;

    const resolver = withCache(fn);
    const result_1 = resolver("one");
    const result_2 = resolver("two");
    const result_1_cached = resolver("one");
    const result_2_cached = resolver("two");

    assert.strictEqual(fn.called, 2);
    assert.strictEqual(result_1, result_1_cached);
    assert.strictEqual(result_2, result_2_cached);
  });

  it("should accept custom keymaker returning constant key returning first call", () => {
    const fn = (_: any) => {
      fn.called += 1;
      return Date.now();
    };

    fn.called = 0;
    const keymaker = (_: any) => "key";
    const resolver = withCache(fn, { keymaker });
    const result_1 = resolver(Math.random());
    const result_2 = resolver(Math.random());

    assert.strictEqual(fn.called, 1);
    assert.strictEqual(result_1, result_2);
  });

  it("should accept custom keymaker resolving value based on created key", () => {
    const fn = (_label: any, _id: any) => {
      fn.called += 1;
      return Date.now();
    };

    fn.called = 0;
    const keymaker = (label: any, id: any) => `${label}_${id}`;

    const resolver = withCache(fn, { keymaker });
    const id_1 = Math.random();
    const id_2 = Math.random();

    const result_1 = resolver("uno", id_1);
    const result_2 = resolver("dos", id_2);
    const result_3 = resolver("uno", id_1);
    const result_4 = resolver("dos", id_2);

    assert.strictEqual(fn.called, 2);
    assert.strictEqual(result_1, result_3);
    assert.strictEqual(result_2, result_4);
  });

  it("should call async function only once and then return cached value", () => {
    const fn = async () => {
      fn.called += 1;
      return Date.now();
    };

    fn.called = 0;

    const resolver = withCache(fn);
    const r1 = resolver();
    resolver();
    const r2 = resolver();

    assert.strictEqual(fn.called, 1);
    assert.strictEqual(r1, r2);
  });

  it("should have method to force calculation", () => {
    const fn = () => {
      return Date.now();
    };

    const resolver = withCache(fn);
    assert(typeof resolver.clear, "function");
  });

  it("should recalculate result when cache is cleared", () => {
    const fn = () => {
      fn.called += 1;
      return Date.now();
    };
    fn.called = 0;

    const resolver = withCache(fn);

    resolver();
    resolver.clear();
    resolver();

    assert.strictEqual(fn.called, 2);
  });

  it("should handle ttl and recalculate after valid date have passed", async function () {
    const fn = () => {
      fn.called += 1;
      return Date.now();
    };
    fn.called = 0;

    const resolver = withCache(fn, { ttl: 10 });

    resolver();
    resolver();
    await sleep(11);
    resolver();

    assert.strictEqual(fn.called, 2);
  });

  it("should have refresh method", () => {
    const fn = () => {
      return Date.now();
    };

    const resolver = withCache(fn);

    assert(typeof resolver.refresh, "function");
  });

  it("should call cached fn when used refresh", () => {
    const fn = () => {
      fn.called += 1;
      return Date.now();
    };
    fn.called = 0;

    const resolver = withCache(fn);

    resolver();
    resolver.refresh();
    resolver();
    resolver.refresh();
    resolver();
    resolver.refresh();

    assert.strictEqual(fn.called, 4);
  });
});
