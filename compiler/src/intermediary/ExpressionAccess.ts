import { Expression } from "./Expression.ts";

export class ExpressionAccess extends Expression {
  readonly #subject: number;
  readonly #name: number;

  constructor(subject: number, name: number) {
    super();
    this.#subject = subject;
    this.#name = name;
  }

  get subject() {
    return this.#subject;
  }

  get name() {
    return this.#name;
  }
}
