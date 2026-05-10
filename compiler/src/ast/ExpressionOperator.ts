import type { Location } from "#utils";
import { Expression } from "./Expression.ts";

export abstract class ExpressionOperator extends Expression {
  readonly #left: Expression;
  readonly #right: Expression;

  constructor(
    start: Location,
    end: Location,
    left: Expression,
    right: Expression,
  ) {
    super(start, end);
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
