import { Entry } from "./Entry.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";

export class EntryTag extends Entry {
  static Parse(walker: TokenWalker) {
    const [{ key, value }, done] = walker
      .text("key", TokenTypeName.PropertyName)
      .expect("=", TokenTypeName.Punctuation)
      .text("value", TokenTypeName.String)
      .finish();

    return new EntryTag(_context(walker, done), key, JSON.parse(value));
  }

  readonly #key: string;
  readonly #value: string;

  constructor(ctx: EntryContext, key: string, value: string) {
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
