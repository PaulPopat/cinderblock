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

  get namespaces() {
    return this.#ctx.namespace.split("_").reduce((result, name) => [[result[0], name].filter((a) => a).join("_"), ...result], [] as Array<string>);
  }
}
