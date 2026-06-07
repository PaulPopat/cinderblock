import type { Expression } from "./Expression.ts";
import { Operation } from "./Operation.ts";

export class OperationForEach extends Operation {
  readonly #subject: Expression;
  readonly #as: number;
  readonly #routine: Array<Operation>;

  constructor(subject: Expression, as: number, routine: Array<Operation>) {
    super();
    this.#subject = subject;
    this.#as = as;
    this.#routine = routine;
  }

  get subject() {
    return this.#subject;
  }

  get as() {
    return this.#as;
  }

  get routine() {
    return this.#routine;
  }
}
