import type { Expression } from "./Expression.ts";
import { Operation } from "./Operation.ts";

export class OperationCreateVar extends Operation {
  readonly #name: number;
  readonly #value: Expression;

  constructor(name: number, value: Expression) {
    super();
    this.#name = name;
    this.#value = value;
  }

  get name() {
    return this.#name;
  }

  get value() {
    return this.#value;
  }
}
