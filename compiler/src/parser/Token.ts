import type { Location } from "./Location.ts";

export class Token {
  readonly #data: string;
  readonly #location: Location;

  constructor(data: string, location: Location) {
    this.#data = data;
    this.#location = location;
  }

  get data() {
    return this.#data;
  }

  get location() {
    return this.#location;
  }
}
