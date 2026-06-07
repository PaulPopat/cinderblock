import { Expression } from "./Expression.ts";

export class ExpressionHasKey extends Expression {
  readonly #subject: Expression;
  readonly #expected: number;

  constructor(subject: Expression, expected: number) {
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
