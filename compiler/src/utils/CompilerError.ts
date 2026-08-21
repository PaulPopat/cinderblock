import type { Location } from "./Location.ts";

export abstract class CompilerError extends Error {
  readonly #location: Location;

  constructor(message: string, location: Location) {
    super(
      [
        ["Error", message.replace("Error: ", "")].join(": "),
        ["Files", location.file].join(": "),
        ["Line", location.line].join(": "),
        ["Character", location.character].join(": "),
      ].join("\n"),
    );

    this.#location = location;
  }

  get location() {
    return this.#location;
  }
}
