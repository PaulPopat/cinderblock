import test, { describe } from "node:test";
import { Inline } from "@cinderblock/compiler";
import assert from "node:assert";

describe("syntax", () => {
  test("it resolves a let", () => {
    const code = new Inline('let test:let "hello";');
    const result = code.app.run("test:let", {});
    assert.equal(result, "hello");
  });

  test("it references another let", () => {
    const code = new Inline(`
      let internal:test "hello";
      let test:let
        use internal;
        test;
    `);
    const result = code.app.run("test:let", {});
    assert.equal(result, "hello");
  });
});
