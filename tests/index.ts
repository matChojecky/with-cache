import assert from "assert";
import { withCache } from "../src/index";

describe("withCache", () => {
  it("should return function", () => {
    const cached = withCache(() => {});

    assert.equal(typeof cached, "function");
  });

  it("should call function only once and then return cached value", () => {
    const fn = () => {
      fn.called += 1;
      return Date.now(); 
    };

    fn.called = 0;

    const cached = withCache(fn);
    const r1 = cached();
    cached();
    const r2 = cached();

    assert.equal(fn.called, 1);
    assert.equal(r1, r2);
  });



  //   it("should .purge method exist and reset cache", () => {
  //     const fn = () => {
  //       fn.called += 1;
  //     };

  //     fn.called = 0;

  //     const cached = withCache(fn);
  //     cached();
  //     cached();

  //     assert.equal(typeof cached.purge, "function");

  //     cached.purge();
  //     cached();

  //     assert.equal(fn.called, 2);
  //   });
});
