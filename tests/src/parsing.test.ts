import { Inline } from "@cinderblock/compiler";
import test, { describe } from "node:test";

describe("parsing", () => {
  test("parses multiple arguements", () => {
    new Inline(`
      let services_PasswordService_Matches (original: string, _s: string) = original;
    `);
  });
});
