import { Names } from "#utils";
import type { EntryContext } from "./EntryContext.ts";

export class Entry {
  readonly #id = Names.Next;
  readonly #ctx: EntryContext;

  constructor(ctx: EntryContext) {
    this.#ctx = ctx;
  }

  get id() {
    return this.#id;
  }

  get ctx() {
    return this.#ctx;
  }

  get entities() {
    return this.#ctx.entities;
  }
}
