import type { Location } from "#utils";
import { Expression } from "./Expression.ts";

export class ExpressionTuple extends Expression {
  readonly #parts: Array<Expression>;

  constructor(start: Location, end: Location, parts: Array<Expression>) {
    super(start, end);
    this.#parts = parts;
  }

  get parts() {
    return this.#parts;
  }
}
