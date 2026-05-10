import type { Location } from "#utils";
import { Expression } from "./Expression.ts";

export class ExpressionTernary extends Expression {
  readonly #predicate: Expression;
  readonly #positive: Expression;
  readonly #negative: Expression;

  constructor(
    start: Location,
    end: Location,
    predicate: Expression,
    positive: Expression,
    negative: Expression,
  ) {
    super(start, end);
    this.#predicate = predicate;
    this.#positive = positive;
    this.#negative = negative;
  }

  get predicate() {
    return this.#predicate;
  }

  get positive() {
    return this.#positive;
  }

  get negative() {
    return this.#negative;
  }
}
