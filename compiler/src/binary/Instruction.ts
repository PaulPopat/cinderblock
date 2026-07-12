import { Names } from "#utils";

export class Instruction {
  readonly #contents: Array<number | Instruction>;

  constructor(...contents: Array<number | Instruction>) {
    this.#contents = contents;
  }

  get contents() {
    return this.#contents;
  }
}
