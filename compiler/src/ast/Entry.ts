import type { Location } from "#utils";
import type { EntryContext } from "./EntryContext.ts";

export class Entry {
  readonly #ctx: EntryContext;

  constructor(ctx: EntryContext) {
    this.#ctx = ctx;
  }

  get ctx() {
    return this.#ctx;
  }
}
