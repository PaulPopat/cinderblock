import type { Location } from "./Location.ts";
import type { Range } from "./Range.ts";

export abstract class CompilerError extends Error {
  readonly #range: Range;
  readonly #compilerMessage: string;

  constructor(message: string, range: Range) {
    super(
      [
        ["Error", message.replace("Error: ", "")].join(": "),
        ["Files", range.from.file].join(": "),
        ["Line", range.from.line].join(": "),
        ["Character", range.from.character].join(": "),
      ].join("\n"),
    );

    this.#range = range;
    this.#compilerMessage = message;
  }

  get range() {
    return this.#range;
  }

  get compilerMessage() {
    return this.#compilerMessage;
  }
}
