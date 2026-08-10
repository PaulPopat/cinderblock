import test, { describe } from "node:test";
import { Inline } from "@cinderblock/compiler";
import assert from "node:assert";

describe("syntax", () => {
  test("it resolves a let", () => {
    const code = new Inline('let test_let = "hello";');
    const result = code.app.run("test_let", {});
    assert.equal(result, "hello");
  });

  test("it references another let", () => {
    const code = new Inline(`
      let internal_test = "hello";
      let test_let = internal_test;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, "hello");
  });

  test("returns a tuple", () => {
    const code = new Inline(`
      let test_let = test="hello", world=123;
    `);
    const result = code.app.run("test_let", {});
    assert.deepStrictEqual(result, { test: "hello", world: 123 });
  });

  test("accesses a tuple", () => {
    const code = new Inline(`
      let internal_item = test="hello", world=123;
      let test_let = internal_item.test;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, "hello");
  });

  test("adds to an array", () => {
    const code = new Inline(`
      let test_let (input: string[]) = input ++ "hello";
    `);
    const result = code.app.run("test_let", { input: ["something"] });
    assert.deepStrictEqual(result, ["something", "hello"]);
  });

  test("resolves a bool false", () => {
    const code = new Inline(`
      let test_let = false;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, false);
  });

  test("resolves a bool true", () => {
    const code = new Inline(`
      let test_let = true;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, true);
  });

  test("resolves a float", () => {
    const code = new Inline(`
      let test_let = 123.123;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, 123.123);
  });

  test("resolves a float indicated", () => {
    const code = new Inline(`
      let test_let = 123.123f;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, 123.123);
  });

  test("resolves a int", () => {
    const code = new Inline(`
      let test_let = 123;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, 123);
  });

  test("resolves a int indicated", () => {
    const code = new Inline(`
      let test_let = 123i;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, 123);
  });

  test("resolves a string", () => {
    const code = new Inline(`
      let test_let = "hello world";
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, "hello world");
  });

  test("performs an addition", () => {
    const code = new Inline(`
      let test_let = 1 + 2;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, 3);
  });

  test("performs a divide", () => {
    const code = new Inline(`
      let test_let = 4 / 2;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, 2);
  });

  test("performs an equality check", () => {
    const code = new Inline(`
      let test_let = 4 == 2;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, false);
  });

  test("performs an greater than", () => {
    const code = new Inline(`
      let test_let = 4 > 2;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, true);
  });

  test("performs an greater than or equal to", () => {
    const code = new Inline(`
      let test_let = 4 >= 4;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, true);
  });

  test("performs an in operation", () => {
    const code = new Inline(`
      let something = hello = "world";
      let test_let = "hello" in something;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, true);
  });

  test("performs an in operation that is false", () => {
    const code = new Inline(`
      let something = hello = "world";
      let test_let = "test" in something;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, false);
  });

  test("performs an less than", () => {
    const code = new Inline(`
      let test_let = 4 < 2;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, false);
  });

  test("performs an less than or equal to", () => {
    const code = new Inline(`
      let test_let = 4 <= 4;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, true);
  });

  test("performs a multiplication", () => {
    const code = new Inline(`
      let test_let = 4 * 4;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, 16);
  });

  test("performs a not equal", () => {
    const code = new Inline(`
      let test_let = 4 != 4;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, false);
  });

  test("performs an or", () => {
    const code = new Inline(`
      let test_let = false || true;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, true);
  });

  test("performs a subtract", () => {
    const code = new Inline(`
      let test_let = 4 - 2;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, 2);
  });

  test("performs a pipe", () => {
    const code = new Inline(`
      let pipeable (test: int) = test + 2;
      let test_let = (test = 2) -> pipeable;
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, 4);
  });

  test("performs a ternary operation", () => {
    const code = new Inline(`
      let test_let = true ? "hello" : "world";
    `);
    const result = code.app.run("test_let", {});
    assert.equal(result, "hello");
  });
});
