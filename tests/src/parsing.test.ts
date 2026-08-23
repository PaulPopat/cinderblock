import { Inline } from "@cinderblock/compiler";
import assert from "node:assert";
import test, { describe } from "node:test";

describe("parsing", () => {
  test("parses multiple arguements", () => {
    new Inline(`
      let services_PasswordService_Matches (original: string, _s: string) = original;
    `);
  });

  test("resolves left to right", async () => {
    const app = new Inline(`
      struct test email: string;
      let main_export (data: test) = "email" in data ? "present" : "not present";
    `);

    const result = await app.run("main_export", { data: { email: "hello" } });

    assert.equal(result, "present");
  });

  test("resolves access in maths", async () => {
    const app = new Inline(`
      struct test email: string;
      let main_export (data: test) = "hello" == data.email ? "present" : "not present";
    `);

    const result = await app.run("main_export", { data: { email: "hello" } });

    assert.equal(result, "present");
  });
});
