import type { Range } from "#utils";
import type { TokenTypeName } from "./TokenTypeName.ts";

export class TokenType {
  readonly #range: Range;
  readonly #typeName: TokenTypeName;

  constructor(range: Range, typeName: TokenTypeName) {
    this.#range = range;
    this.#typeName = typeName;
  }

  get range() {
    return this.#range;
  }

  get typeName() {
    return this.#typeName;
  }
}
