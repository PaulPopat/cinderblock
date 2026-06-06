import type { Operation } from "./Operation.ts";
import type { RoutineArg } from "./RoutineArg.ts";

export class Routine {
  readonly #name: number;
  readonly #args: Array<RoutineArg>;
  readonly #operations: Array<Operation>;

  constructor(
    name: number,
    args: Array<RoutineArg>,
    operations: Array<Operation>,
  ) {
    this.#name = name;
    this.#args = args;
    this.#operations = operations;
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
}
