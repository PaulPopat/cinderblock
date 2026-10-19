import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";

export abstract class ExpressionOperator extends Expression {
  readonly #left: Expression;
  readonly #right: Expression;

  constructor(ctx: EntryContext, left: Expression, right: Expression) {
    super(ctx);
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
