import type { Range } from "#utils";

export class Token {
  readonly #data: string;
  readonly #range: Range;

  constructor(data: string, range: Range) {
    this.#data = data;
    this.#range = range;
  }

  get data() {
    return this.#data;
  }

  get range() {
    return this.#range;
  }
}
