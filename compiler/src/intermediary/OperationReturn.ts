import type { Expression } from "./Expression.ts";
import { Operation } from "./Operation.ts";

export class OperationReturn extends Operation {
  readonly #value: Expression;

  constructor(value: Expression) {
    super();
    this.#value = value;
  }

  get value() {
    return this.#value;
  }
}
