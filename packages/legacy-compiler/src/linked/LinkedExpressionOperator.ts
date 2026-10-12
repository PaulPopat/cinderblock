import type { Range } from "#utils";
import type { CreateFunc } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";

export abstract class LinkedExpressionOperator extends LinkedExpression {
  readonly #left: LinkedExpression;
  readonly #right: LinkedExpression;

  constructor(range: Range, left: LinkedExpression, right: LinkedExpression) {
    super(range);
    this.#left = left;
    this.#right = right;
  }

  get left() {
    return this.#left;
  }

  get right() {
    return this.#right;
  }

  get funcs(): Array<CreateFunc> {
    return [...this.#left.funcs, ...this.#right.funcs];
  }
}
