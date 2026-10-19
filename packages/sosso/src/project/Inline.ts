import { compileCinderblock, type BinaryData } from "@cinderblock-lang/legacy-compiler";
import { CinderBlockBinary } from "@cinderblock-lang/runner";

export class Inline {
  readonly #data: BinaryData;

  constructor(code: string) {
    this.#data = compileCinderblock([["inline", code]]);
  }

  get types() {
    return this.#data.types;
  }

  binary(globals: Record<string, unknown> = {}) {
    const { data, metadata } = this.#data;
    return CinderBlockBinary.FromMemory(data, metadata, globals);
  }
}
