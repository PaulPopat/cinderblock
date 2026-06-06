import type { Expression } from "./Expression.ts";

export class OperationPrepareRoutine {
  readonly #expression: Expression;

  constructor(expression: Expression) {
    this.#expression = expression;
  }

  get expression() {
    return this.#expression;
  }
}
