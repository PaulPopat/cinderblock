import { describe, it } from "node:test";
import { Tokeniser } from "./Tokeniser.ts";
import assert from "node:assert";

describe("Tokeniser", () => {
  it("parses some characters correctly", () => {
    const sut = new Tokeniser("file_name", "this is a test !=");

    assert.deepEqual(
      sut.tokens.raw.map((t) => t.data),
      ["this", "is", "a", "test", "!="],
    );
  });

  it("breaks on character class change", () => {
    const sut = new Tokeniser("file_name", "this is a test!=");

    assert.deepEqual(
      sut.tokens.raw.map((t) => t.data),
      ["this", "is", "a", "test", "!="],
    );
  });
});
