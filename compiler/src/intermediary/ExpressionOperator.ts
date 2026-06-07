import { Expression } from "./Expression.ts";

export abstract class ExpressionOperator extends Expression {
  readonly #left: number;
  readonly #right: number;

  constructor(left: number, right: number) {
    super();
    this.#left = left;
    this.#right = right;
  }

  get left() {
    return this.#left;
  }

  get right() {
    return this.#right;
  }
}
