import type { Range } from "#utils";
import type { TokenTypeName } from "./TokenTypeName.ts";

export class TokenType {
  readonly #range: Range;
  readonly #entry: (() => unknown) | undefined;
  readonly #typeName: TokenTypeName;

  constructor(range: Range, entry: (() => unknown) | undefined, typeName: TokenTypeName) {
    this.#range = range;
    this.#entry = entry;
    this.#typeName = typeName;
  }

  get range() {
    return this.#range;
  }

  get typeName() {
    return this.#typeName;
  }

  get entry() {
    return this.#entry?.();
  }
}
