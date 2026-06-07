import type { Binary } from "./Binary.ts";
import type { Operation } from "./Operation.ts";

export class Routine {
  readonly #name: string;
  readonly #args: Array<number>;
  readonly #operations: Array<Operation>;
  readonly #exported: boolean;

  constructor(
    name: string,
    args: Array<number>,
    operations: Array<Operation>,
    exported: boolean,
  ) {
    this.#name = name;
    this.#args = args;
    this.#operations = operations;
    this.#exported = exported;
  }

  get name() {
    return this.#name;
  }

  get args() {
    return this.#args;
  }

  get operations() {
    return this.#operations;
  }

  get exported() {
    return this.#exported;
  }
}
