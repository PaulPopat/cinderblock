import { Entry } from "./Entry.ts";
import type { TokenWalker } from "./TokenWalker.ts";

export class EntryTag extends Entry {
  readonly #key: string;
  readonly #value: unknown;

  constructor(walker: TokenWalker, parent: () => Entry | undefined) {
    const [{ key, value }, done] = walker.text("key").expect("=").text("value").finish();
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
}
