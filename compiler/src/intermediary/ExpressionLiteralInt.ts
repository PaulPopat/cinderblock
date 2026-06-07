import { ExpressionLiteral } from "./ExpressionLiteral.ts";

export class ExpressionLiteralInt extends ExpressionLiteral {
  readonly #value: string;

  constructor(value: string) {
    super();
    this.#value = value;
  }

  get value() {
    return this.#value;
  }
}
