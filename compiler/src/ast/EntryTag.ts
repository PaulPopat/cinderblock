import { Entry } from "./Entry.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TokenTypeName } from "#tokeniser";

export class EntryTag extends Entry {
  readonly #key: string;
  readonly #value: unknown;

  constructor(walker: TokenWalker, parent: () => Entry | undefined) {
    const [{ key, value }, done] = walker
      .text("key", TokenTypeName.PropertyName)
      .expect("=", TokenTypeName.Punctuation)
      .text("value", TokenTypeName.String)
      .finish();
    super(walker.location, done, parent);
    this.#key = key;
    this.#value = JSON.parse(value);
  }

  get key() {
    return this.#key;
  }

  get value() {
    return this.#value;
  }

  float(name: string): Entry | undefined {
    return undefined;
  }

  dig(name: string): Entry | undefined {
    return undefined;
  }
}
