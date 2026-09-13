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

  within(file: string, line: number, character: number) {
    if (file !== this.#from.file || line < this.#from.line || line > this.#to.line) return false;

    if (this.#from.line === this.#to.line) {
      return character >= this.#from.character && character <= this.#to.character;
    }

    if (line !== this.#from.line && line !== this.#to.line) {
      return true;
    }

    if (line === this.#from.line) {
      return character >= this.#from.character;
    }

    return character <= this.#to.character;
  }
}
