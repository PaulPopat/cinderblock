import type { Expression } from "./Expression.ts";
import { Operation } from "./Operation.ts";

export class OperationIf extends Operation {
  readonly #subject: Expression;
  readonly #positive: Array<Operation>;
  readonly #negative: Array<Operation>;

  constructor(
    subject: Expression,
    positive: Array<Operation>,
    negative: Array<Operation>,
  ) {
    super();
    this.#subject = subject;
    this.#positive = positive;
    this.#negative = negative;
  }

  get subject() {
    return this.#subject;
  }

  get positive() {
    return this.#positive;
  }

  get negative() {
    return this.#negative;
  }
}
