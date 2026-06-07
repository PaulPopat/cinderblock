import { ExpressionLiteral } from "./ExpressionLiteral.ts";

export class ExpressionLiteralBool extends ExpressionLiteral {
  readonly #value: boolean;

  constructor(value: boolean) {
    super();
    this.#value = value;
  }

  get value() {
    return this.#value;
  }
}
