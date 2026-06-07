import { Expression } from "./Expression.ts";

export class ExpressionTuple extends Expression {
  readonly #parts: Array<[number, number]>;

  constructor(parts: Array<[number, number]>) {
    super();
    this.#parts = parts;
  }

  get parts() {
    return this.#parts;
  }
}
