import { Expression } from "./Expression.ts";

export class ExpressionArrayAdd extends Expression {
  readonly #subject: number;
  readonly #addition: number;

  constructor(subject: number, addition: number) {
    super();
    this.#subject = subject;
    this.#addition = addition;
  }

  get subject() {
    return this.#subject;
  }

  get addition() {
    return this.#addition;
  }
}
