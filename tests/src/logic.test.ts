import test, { describe } from "node:test";
import { Inline } from "@cinderblock-lang/legacy-compiler";
import assert from "node:assert";

describe("logic", () => {
  test("it accesses lets from before", async () => {
    const code = new Inline(`
      let test_let = internal_let;
      let internal_let = "hello";
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, "hello");
  });

  test("only calculates a let with no arguments once", async () => {
    let total = 1;
    const code = new Inline(
      `
        extern get_total (): int;
        let test_let =
            let internal_let = {} -> get_total;
          internal_let + internal_let;
      `,
    );
    const result = await code
      .binary({
        get_total: () => total++,
      })
      .run("test_let", {});
    assert.equal(result, 2);
  });

  test("adds strings in the correct order", async () => {
    const code = new Inline(`
      let test_let = "hello" + "." + "world";
    `);
    const result = await code.binary().run("test_let", {});
    assert.equal(result, "hello.world");
  });

  test("only parses the right of an && when needed", async () => {
    const code = new Inline(`
      struct Input value: bool;
      let test_let (input: Input) = false && input.value;
    `);
    const result = await code.binary().run("test_let", { input: { value: "I am not a boolean" } });
    assert.equal(result, false);
  });

  test("can see the args of a parent let", async () => {
    const code = new Inline(`
      let test_let (value: string) =
          let internal = value;
        internal;
    `);
    const result = await code.binary().run("test_let", { value: "hello.world" });
    assert.equal(result, "hello.world");
  });

  test("resolves use statements in a namespace", async () => {
    const code = new Inline(
      `
        let internal_item = "hello";
        namespace test {
          use internal;

          let test = item + item;
        }
      `,
    );
    const result = await code.binary().run("test_test", {});
    assert.equal(result, "hellohello");
  });

  test("resolves nested namespaces", async () => {
    const code = new Inline(
      `
        namespace internal {
          let item = "hello";
        }

        namespace test {
          use internal;

          let test = item + item;
        }
      `,
    );
    const result = await code.binary().run("test_test", {});
    assert.equal(result, "hellohello");
  });

  test("resolves nested namespaces with the same start", async () => {
    const code = new Inline(
      `
        namespace thing_internal {
          let item = "hello";
        }

        namespace thing_test {
          let test = internal_item + internal_item;
        }
      `,
    );
    const result = await code.binary().run("thing_test_test", {});
    assert.equal(result, "hellohello");
  });

  test("partial pipe", async () => {
    const code = new Inline(
      `
        let multiple (left: string, right: string) = left + " " + right;

        let result_entry =
            let partial = { left = "hello" } -> multiple;
          { right = "world" } -> partial;
      `,
    );
    const result = await code.binary().run("result_entry", {});
    assert.equal(result, "hello world");
  });

  test("maths between two types", async () => {
    const code = new Inline(
      `
        let result = 2 + 2.0f;
      `,
    );
    const result = await code.binary().run("result", {});
    assert.equal(result, 4);
  });

  test("struct referencing error case 1", async () => {
    const code = new Inline(
      `
        namespace cinder_utils {
          struct Location
            file: string
            line: int
            character: int
          ;
        }

        namespace cinder_utils {
          struct Range
            from: Location
            to: Location
          ;

          let range_within (_s: Range, potential: Location) =
            (potential.file != _s.from.file) || (potential.line < _s.from.line) || (potential.line > _s.to.line)
              ? false
              : _s.from.line == _s.to.line
              ? (potential.character >= _s.from.character) && (potential.character <= _s.to.character)
              : (potential.line != _s.from.line) && (potential.line != _s.to.line)
              ? true
              : potential.line == _s.from.line
              ? potential.character >= _s.from.character
              : potential.character <= _s.to.character;
        }
      `,
    );
    const result = await code.binary().run("cinder_utils_range_within", {
      _s: {
        from: {
          file: "test",
          line: 1,
          character: 0,
        },
        to: {
          file: "test",
          line: 5,
          character: 0,
        },
      },
      potential: {
        file: "test",
        line: 2,
        character: 0,
      },
    });
    assert.equal(result, true);
  });

  test("unknown argument inference", async () => {
    const code = new Inline(
      `
        let internal (_s: unknown) = _s;
        let result = ({ test = "data" } --> internal).test;
      `,
    );
    const result = await code.binary().run("result", {});
    assert.equal(result, "data");
  });
});
