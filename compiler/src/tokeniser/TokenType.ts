import type { Location } from "#utils";
import type { TokenTypeName } from "./TokenTypeName.ts";

export class TokenType {
  readonly #to: Location;
  readonly #from: Location;
  readonly #typeName: TokenTypeName;

  constructor(from: Location, to: Location, typeName: TokenTypeName) {
    this.#from = from;
    this.#to = to;
    this.#typeName = typeName;
  }

  get to() {
    return this.#to;
  }

  get from() {
    return this.#from;
  }

  get typeName() {
    return this.#typeName;
  }
}
