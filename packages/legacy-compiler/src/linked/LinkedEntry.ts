import type { Range } from "#utils";

export abstract class LinkedEntry {
  readonly #range: Range;

  constructor(range: Range) {
    this.#range = range;
  }

  get range() {
    return this.#range;
  }
}
