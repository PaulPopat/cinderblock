import { Inline } from "@cinderblock-lang/compiler";
import assert from "node:assert";
import test, { describe } from "node:test";

describe("input output", () => {
  test("imports a function", async () => {
    const code = new Inline(`
      let test_let (add: (input: int): int) = { input = 2 } -> add;
    `);
    const result = await code.binary().run("test_let", {
      add({ input }: { input: number }) {
        return input + 3;
      },
    });

    assert.equal(result, 5);
  });

  test("imports an async function", async () => {
    const code = new Inline(`
      let test_let (add: (input: int): int) = { input = 2 } -> add;
    `);
    const result = await code.binary().run("test_let", {
      async add({ input }: { input: number }) {
        return input + 3;
      },
    });

    assert.equal(result, 5);
  });

  test("imports a global async function", async () => {
    const code = new Inline(`
      extern add (input: int): int;
      let test_let = { input = 2 } -> add;
    `);
    const result = await code
      .binary({
        async add({ input }: { input: number }) {
          return input + 3;
        },
      })
      .run("test_let", {});

    assert.equal(result, 5);
  });

  test.skip("exports a function", async () => {
    const code = new Inline(`
      let pipeable_let (input: int) = input + 3;
      let test_let = pipeable_let;
    `);
    const result: any = await code.binary().run("test_let", {});

    assert.equal(await result({ input: 2 }), 5);
  });
});
