import type { Instruction } from "./Instruction.ts";

export class Binary {
  static get Start() {
    return new Binary([]);
  }

  readonly #instructions: Array<Instruction>;

  private constructor(instructions: Array<Instruction>) {
    this.#instructions = instructions;
  }

  get instructions() {
    return [...this.#instructions];
  }

  including(processor: (binary: Binary) => Binary) {
    return processor(this);
  }

  with(...instructions: Array<Instruction>) {
    return new Binary([...this.#instructions, ...instructions]);
  }

  prefixed(...instructions: Array<Instruction>) {
    return new Binary([...instructions, ...this.#instructions]);
  }

  concat(bin: Binary) {
    return new Binary([...bin.#instructions, ...this.#instructions]);
  }
}
