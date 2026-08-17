import { Inline } from "@cinderblock/compiler";
import assert from "node:assert";
import test, { describe } from "node:test";

describe("input output", () => {
  test("imports a function", () => {
    const code = new Inline("let test_let (add: (input: int): int) = { input = 2 } -> add;");
    const result = code.app.run("test_let", {
      add({ input }: { input: number }) {
        return input + 3;
      },
    });

    assert.equal(result, 5);
  });

  test("exports a function", () => {
    const code = new Inline(`
      let pipeable_let (input: int) = input + 3;
      let test_let = pipeable_let;
    `);
    const result = code.app.run("test_let", {});

    assert.equal(result({ input: 2 }), 5);
  });
});
