import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";

export class ExpressionLiteralChar extends ExpressionLiteral {
  readonly #value: string;

  constructor(value: string) {
    super();
    this.#value = value;
  }

  get value() {
    return this.#value;
  }
}
