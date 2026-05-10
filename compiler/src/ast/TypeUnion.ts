import type { Location } from "#utils";
import { Type } from "./Type.ts";

export class TypeUnion extends Type {
  readonly #left: Type;
  readonly #right: Type;

  constructor(start: Location, end: Location, left: Type, right: Type) {
    super(start, end);
    this.#left = left;
    this.#right = right;
  }

  get left() {
    return this.#left;
  }

  get right() {
    return this.#right;
  }
}
