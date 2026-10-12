import type { Range } from "#utils";
import type { Shape } from "#writer";
import { LinkedType } from "./LinkedType.ts";

export class LinkedTypeArray extends LinkedType {
  readonly #contains: LinkedType;

  constructor(range: Range, contains: LinkedType) {
    super(range);
    this.#contains = contains;
  }

  get contains() {
    return this.#contains;
  }

  shape(): Shape {
    return { type: "array", value: this.#contains.shape() };
  }

  compatible(input: LinkedType): boolean {
    return input instanceof LinkedTypeArray && this.contains.compatible(input.contains);
  }
}
