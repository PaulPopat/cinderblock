import type { Location } from "./Location.ts";

export class Range {
  readonly #from: Location;
  readonly #to: Location;

  constructor(from: Location, to: Location) {
    this.#from = from;
    this.#to = to;
  }

  get from() {
    return this.#from;
  }

  get to() {
    return this.#to;
  }
}
