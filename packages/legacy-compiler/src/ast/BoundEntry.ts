import type { Entry } from "./Entry.ts";
import { LinkerContext } from "./LinkerContext.ts";

export class BoundEntry<TSubject extends Entry> {
  readonly #closure: Record<string, unknown>;
  readonly #subject: TSubject;

  private constructor(closure: Record<string, unknown>, subject: TSubject) {
    this.#closure = closure;
    this.#subject = subject;
  }

  get context() {
    return LinkerContext.From(this.#closure);
  }

  is<TExpected extends Entry>(...expected: Array<new (...args: Array<any>) => TExpected>): this is BoundEntry<TExpected> {
    return expected.some((e) => this.#subject instanceof e);
  }

  get subject() {
    return this.#subject;
  }
}
