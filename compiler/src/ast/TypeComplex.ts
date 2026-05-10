import type { Location } from "#utils";
import type { Arg } from "./Arg.ts";
import { Type } from "./Type.ts";

export class TypeComplex extends Type {
  readonly #args: Array<Arg>;

  constructor(start: Location, end: Location, args: Array<Arg>) {
    super(start, end);
    this.#args = args;
  }

  get args() {
    return this.#args;
  }
}
