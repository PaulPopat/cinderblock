import type { Location } from "#utils";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";

export class ExpressionLiteralInt extends ExpressionLiteral {
  readonly #value: number;

  constructor(start: Location, end: Location, value: number) {
    super(start, end);
    this.#value = value;
  }

  get value() {
    return this.#value;
  }
}
