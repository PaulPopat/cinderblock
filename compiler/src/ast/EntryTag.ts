import { Entry } from "./Entry.ts";
import type { EntryContext } from "./EntryContext.ts";

export class EntryTag extends Entry {
  readonly #key: string;
  readonly #value: unknown;

  constructor(ctx: EntryContext, key: string, value: unknown) {
    super(ctx);
    this.#key = key;
    this.#value = value;
  }

  get key() {
    return this.#key;
  }

  get value() {
    return this.#value;
  }
}
