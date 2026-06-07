import { Expression } from "./Expression.ts";

export class ExpressionReference extends Expression {
  readonly #name: number;

  constructor(name: number) {
    super();
    this.#name = name;
  }

  get name() {
    return this.#name;
  }
}
