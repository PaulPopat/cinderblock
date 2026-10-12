import { Range } from "#utils";
import type { EntryContext } from "./EntryContext.ts";

export abstract class Entry {
  readonly #ctx: EntryContext;

  constructor(ctx: EntryContext) {
    this.#ctx = ctx;
  }

  get location() {
    return this.#ctx.location;
  }

  get range() {
    return new Range(this.#ctx.location, this.#ctx.done.previous.range.to);
  }

  get done() {
    return this.#ctx.done;
  }

  get ctx() {
    return this.#ctx;
  }
}
