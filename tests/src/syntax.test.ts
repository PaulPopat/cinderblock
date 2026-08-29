import test, { describe } from "node:test";
import { Inline } from "@cinderblock/compiler";
import assert from "node:assert";

describe("syntax", () => {
  test("it resolves a let", async () => {
    const code = new Inline('let test_let = "hello";');
    const result = await code.binary().run("test_let", {});
    assert.equal(result, "hello");
  });

  test("uses a namespace", async () => {
    const code = new Inline('namespace test { let name = "hello"; }');
    const result = await code.binary().run("test_name", {});
    assert.equal(result, "hello");
  });

  test("tags a let", async () => {
    const code = new Inline('let [key="test value"] test_let = "hello";');
    const found = code.binary().withTag("key", "test value");
    assert.equal(found.length, 1);
  });

  test("it references another let", async () => {
    const code = new Inline(`
      let internal_test = "hello";
      let test_let = internal_test;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, "hello");
  });

  test("returns an array", async () => {
    const code = new Inline(`
      let test_let = ["hello", "world"];
    `);
    const result = await code.binary().run("test_let", {});
    assert.deepStrictEqual(result, ["hello", "world"]);
  });

  test("returns an array with a trailing comma", async () => {
    const code = new Inline(`
      let test_let = ["hello", "world",];
    `);
    const result = await code.binary().run("test_let", {});
    assert.deepStrictEqual(result, ["hello", "world"]);
  });

  test("returns an empty array", async () => {
    const code = new Inline(`
      let test_let = [];
    `);
    const result = await code.binary().run("test_let", {});
    assert.deepStrictEqual(result, []);
  });

  test("returns an empty array with a gap", async () => {
    const code = new Inline(`
      let test_let = [ ];
    `);
    const result = await code.binary().run("test_let", {});
    assert.deepStrictEqual(result, []);
  });

  test("returns a tuple", async () => {
    const code = new Inline(`
      let test_let = {test="hello", world=123};
    `);
    const result = await code.binary().run("test_let", {});
    assert.deepStrictEqual(result, { test: "hello", world: 123 });
  });

  test("returns a tuple with a trailing comma", async () => {
    const code = new Inline(`
      let test_let = {test="hello", world=123,};
    `);
    const result = await code.binary().run("test_let", {});
    assert.deepStrictEqual(result, { test: "hello", world: 123 });
  });

  test("returns a tuple with string property names", async () => {
    const code = new Inline(`
      let test_let = {"test-name"="hello", world=123};
    `);
    const result = await code.binary().run("test_let", {});
    assert.deepStrictEqual(result, { "test-name": "hello", world: 123 });
  });

  test("returns an empty tuple", async () => {
    const code = new Inline(`
      let test_let = {};
    `);
    const result = await code.binary().run("test_let", {});
    assert.deepStrictEqual(result, {});
  });

  test("accesses a tuple", async () => {
    const code = new Inline(`
      let internal_item = {test="hello", world=123};
      let test_let = internal_item.test;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, "hello");
  });

  test("adds to an array", async () => {
    const code = new Inline(`
      let test_let (input: string[]) = input ++ "hello";
    `);
    const result = await code.binary().run("test_let", { input: ["something"] });
    assert.deepStrictEqual(result, ["something", "hello"]);
  });

  test("resolves a bool false", async () => {
    const code = new Inline(`
      let test_let = false;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, false);
  });

  test("resolves a bool true", async () => {
    const code = new Inline(`
      let test_let = true;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, true);
  });

  test("resolves a float", async () => {
    const code = new Inline(`
      let test_let = 123.123;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, 123.123);
  });

  test("resolves a float indicated", async () => {
    const code = new Inline(`
      let test_let = 123.123f;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, 123.123);
  });

  test("resolves a int", async () => {
    const code = new Inline(`
      let test_let = 123;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, 123);
  });

  test("resolves a int indicated", async () => {
    const code = new Inline(`
      let test_let = 123i;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, 123);
  });

  test("resolves a string", async () => {
    const code = new Inline(`
      let test_let = "hello world";
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, "hello world");
  });

  test("performs an addition", async () => {
    const code = new Inline(`
      let test_let = 1 + 2;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, 3);
  });

  test("performs a divide", async () => {
    const code = new Inline(`
      let test_let = 4 / 2;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, 2);
  });

  test("performs an equality check", async () => {
    const code = new Inline(`
      let test_let = 4 == 2;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, false);
  });

  test("performs an greater than", async () => {
    const code = new Inline(`
      let test_let = 4 > 2;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, true);
  });

  test("performs an greater than or equal to", async () => {
    const code = new Inline(`
      let test_let = 4 >= 4;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, true);
  });

  test("performs an in operation", async () => {
    const code = new Inline(`
      let something = {hello = "world"};
      let test_let = "hello" in something;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, true);
  });

  test("performs an in operation that is false", async () => {
    const code = new Inline(`
      let something = {hello = "world"};
      let test_let = "test" in something;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, false);
  });

  test("performs an less than", async () => {
    const code = new Inline(`
      let test_let = 4 < 2;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, false);
  });

  test("performs an less than or equal to", async () => {
    const code = new Inline(`
      let test_let = 4 <= 4;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, true);
  });

  test("performs a multiplication", async () => {
    const code = new Inline(`
      let test_let = 4 * 4;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, 16);
  });

  test("performs a not equal", async () => {
    const code = new Inline(`
      let test_let = 4 != 4;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, false);
  });

  test("performs an or", async () => {
    const code = new Inline(`
      let test_let = false || true;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, true);
  });

  test("performs a subtract", async () => {
    const code = new Inline(`
      let test_let = 4 - 2;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, 2);
  });

  test("performs a pipe", async () => {
    const code = new Inline(`
      let pipeable (test: int) = test + 2;
      let test_let = {test = 2} -> pipeable;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, 4);
  });

  test("performs a pipe of a basic", async () => {
    const code = new Inline(`
      let pipeable (_s: int) = _s + 2;
      let test_let = 2 -> pipeable;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, 4);
  });

  test("performs a ternary operation", async () => {
    const code = new Inline(`
      let test_let = true ? "hello" : "world";
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, "hello");
  });

  test("struct reference", async () => {
    const code = new Inline(`
      struct mystruct value: int;
      let pipeable (test: mystruct) = test.value + 2;
      let test_let = {test = {value = 2}} -> pipeable;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, 4);
  });

  test("tuple arg", async () => {
    const code = new Inline(`
      let pipeable (test: {value: int}) = test.value + 2;
      let test_let = {test = {value = 2}} -> pipeable;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, 4);
  });

  test("type union", async () => {
    const code = new Inline(`
      let final (test: {value: int}) = test.value + 2;
      let pipeable (test: {value: int} | {value: float}) = {test = test} -> final;
      let test_let = {test = {value = 2}} -> pipeable;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, 4);
  });

  test("type intersection", async () => {
    const code = new Inline(`
      let final (test: {value: int}) = test.value + 2;
      let pipeable (test: {value: int} & {another: float}) = {test = test} -> final;
      let test_let = {test = {value = 2}} -> pipeable;
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, 4);
  });
});
