import type { Operation } from "./Operation.ts";

export class Routine {
  readonly #operations: Array<Operation>;

  constructor(operations: Array<Operation>) {
    this.#operations = operations;
  }

  get operations() {
    return this.#operations;
  }
}
