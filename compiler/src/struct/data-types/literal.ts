import type ISerialiseable from "./base.ts";
import type { IBufferWriter, IBufferReader } from "./base.ts";

export class Literal<T extends string | number | boolean> implements ISerialiseable<T> {
  #structure: T;

  constructor(structure: T) {
    this.#structure = structure;
  }

  Impart(_1: T, _2: IBufferWriter): void {}

  Accept(_: IBufferReader): T {
    return this.#structure;
  }

  Confirm(value: unknown): value is T {
    return value === this.#structure;
  }
}
