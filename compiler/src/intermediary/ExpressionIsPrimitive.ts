import { Expression } from "./Expression.ts";
import type { PrimitiveKey } from "./PrimitiveKey.ts";

export class ExpressionIsPrimitive extends Expression {
  readonly #subject: Expression;
  readonly #expected: PrimitiveKey;

  constructor(subject: Expression, expected: PrimitiveKey) {
    super();
    this.#subject = subject;
    this.#expected = expected;
  }

  get subject() {
    return this.#subject;
  }

  get expected() {
    return this.#expected;
  }
}
