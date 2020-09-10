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

    const resolver = withCache(fn);
    const r1 = resolver();
    resolver();
    const r2 = resolver();

    assert.equal(fn.called, 1);
    assert.equal(r1, r2);
  });

  it('should accept args and return different cached values based on passed args', () => {
    const fn = (_: any) => {
      fn.called += 1;
      return Date.now(); 
    };

    fn.called = 0;

    const resolver = withCache(fn);
    const result_1 = resolver('one');
    const result_2 = resolver('two');
    const result_1_cached = resolver('one');
    const result_2_cached = resolver('two');

    assert.equal(fn.called, 2);
    assert.equal(result_1, result_1_cached);
    assert.equal(result_2, result_2_cached);

  });

  it('should accept custom keymaker returning constant key returning first call', () => {
    const fn = (_: any) => {
      fn.called += 1;
      return Date.now(); 
    };

    fn.called = 0;
    const keymaker = (_: any) => 'key';
    const resolver = withCache(fn, {keymaker});
    const result_1 = resolver(Math.random());
    const result_2 = resolver(Math.random());

    assert.equal(fn.called, 1);
    assert.equal(result_1, result_2);
  });

  it('should accept custom keymaker resolving value based on created key', () => {
    const fn = (_label: any, _id: any) => {
      fn.called += 1;
      return Date.now(); 
    };

    fn.called = 0;
    const keymaker = (label: any, id: any) => `${label}_${id}`;
    
    const resolver = withCache(fn, {keymaker});
    const id_1 = Math.random();
    const id_2 = Math.random();

    const result_1 = resolver("uno", id_1);
    const result_2 = resolver("dos", id_2);
    const result_3 = resolver("uno", id_1);
    const result_4 = resolver("dos", id_2);

    assert.equal(fn.called, 2);
    assert.equal(result_1, result_3);
    assert.equal(result_2, result_4);
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
