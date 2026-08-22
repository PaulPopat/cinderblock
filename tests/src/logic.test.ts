import test, { describe } from "node:test";
import { Inline } from "@cinderblock/compiler";
import assert from "node:assert";

describe("logic", () => {
  test("it accesses lets from before", async () => {
    const code = new Inline(`
      let test_let = internal_let;
      let internal_let = "hello";
    `);
    const result = await code.run("test_let", {});
    assert.equal(result, "hello");
  });

  test("only calculates a let with no arguments once", async () => {
    let total = 1;
    const code = new Inline(
      `
        let internal_let = {} -> get_total;
        let test_let = internal_let + internal_let;
      `,
      {
        get_total: () => total++,
      },
    );
    const result = await code.run("test_let", {});
    assert.equal(result, 2);
  });
});
