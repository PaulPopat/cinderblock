import { Project } from "@cinderblock/compiler";
import assert from "node:assert";
import path from "node:path";
import test, { describe } from "node:test";

describe("tokeniser", () => {
  test("tokenises some code", () => {
    const project = new Project(path.resolve(import.meta.dirname, "../../../compiler"));

    const result = project.app.run("Tokens_Tokeniser", {
      file: "test-file.cb",
      text: 'let test = "hello";',
    });

    assert.deepStrictEqual(result, []);
  });
});
