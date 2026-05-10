import type { Location } from "./Location.ts";

export abstract class CompilerError extends Error {
  readonly #location: Location;

  constructor(message: string, location: Location) {
    super(message);

    this.#location = location;
  }

  get location() {
    return this.#location;
  }
}
