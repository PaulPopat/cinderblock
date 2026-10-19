import type { Entry } from "./Entry.ts";
import { LinkerContext } from "./LinkerContext.ts";

export class BoundEntry<TSubject extends Entry> {
  readonly #ctx: LinkerContext;
  readonly #subject: TSubject;

  constructor(ctx: LinkerContext, subject: TSubject) {
    this.#ctx = ctx;
    this.#subject = subject;
  }

  get context() {
    return this.#ctx;
  }

  is<TExpected extends Entry>(...expected: Array<abstract new (...args: Array<any>) => TExpected>): this is BoundEntry<TExpected> {
    return expected.some((e) => this.#subject instanceof e);
  }

  get subject() {
    return this.#subject;
  }
}
